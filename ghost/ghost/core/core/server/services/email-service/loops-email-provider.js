const logging = require('@tryghost/logging');
const errors = require('@tryghost/errors');
const debug = require('@tryghost/debug')('email-service:loops-provider-service');
const crypto = require('crypto');

function base64url(value) {
    return Buffer.from(value).toString('base64url');
}

function getTrackedPostUrl(postUrl, email) {
    const secret = process.env.NEWSLETTER_TRACKING_SECRET;
    const storefrontUrl = process.env.STOREFRONT_URL;

    if (!secret || !storefrontUrl || !postUrl) {
        return postUrl;
    }

    const payload = base64url(JSON.stringify({
        email,
        postUrl,
        exp: Date.now() + (30 * 24 * 60 * 60 * 1000)
    }));
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    return `${storefrontUrl.replace(/\/$/, '')}/api/newsletter/track?token=${payload}.${signature}`;
}

/**
 * @typedef {object} Recipient
 * @prop {string} email
 * @prop {Replacement[]} replacements
 */

/**
 * @typedef {object} Replacement
 * @prop {string} token
 * @prop {string} value
 * @prop {string} id
 */

/**
 * @typedef {object} EmailSendingOptions
 * @prop {boolean} clickTrackingEnabled
 * @prop {boolean} openTrackingEnabled
 * @prop {Date} [deliveryTime]
 */

/**
 * @typedef {object} EmailProviderSuccessResponse
 * @prop {string} id
 */

class LoopsEmailProvider {
    #apiKey;
    #transactionalId;
    #userGroup;
    #errorHandler;

    /**
     * @param {object} dependencies
     * @param {string} [dependencies.apiKey] - Loops API key
     * @param {string} [dependencies.transactionalId] - Optional default Loops Transactional ID
     * @param {string} [dependencies.userGroup] - Default user group in Loops (defaults to "Newsletter")
     * @param {Function} [dependencies.errorHandler] - custom error handler for logging exceptions
     */
    constructor({
        apiKey,
        transactionalId,
        userGroup = 'Newsletter',
        errorHandler
    } = {}) {
        this.#apiKey = apiKey;
        this.#transactionalId = transactionalId;
        this.#userGroup = userGroup;
        this.#errorHandler = errorHandler;
    }

    /**
     * Helper to perform HTTP requests to Loops REST API
     * @private
     * @param {string} endpoint - API path e.g. '/contacts/create' or '/transactional'
     * @param {object} body - JSON payload
     * @returns {Promise<any>}
     */
    async #request(endpoint, body) {
        const apiKey = this.#apiKey || process.env.LOOPS_API_KEY;
        if (!apiKey) {
            throw new errors.EmailError({
                message: 'Loops API key is not configured.',
                code: 'BULK_EMAIL_SEND_FAILED',
                help: 'https://loops.so'
            });
        }

        const url = `https://app.loops.so/api/v1${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data?.message || `Loops API error (${response.status})`;
            throw new errors.EmailError({
                statusCode: response.status,
                message: `Loops Error: ${errorMsg}`,
                errorDetails: JSON.stringify(data),
                code: 'BULK_EMAIL_SEND_FAILED',
                help: 'https://loops.so'
            });
        }

        return data;
    }

    /**
     * Send email newsletter / transactional message via Loops API
     * @param {import('./sending-service').EmailData} data
     * @param {EmailSendingOptions} options
     * @returns {Promise<EmailProviderSuccessResponse>}
     */
    async send(data, options) {
        const {
            subject,
            html,
            plaintext,
            from,
            replyTo,
            postUrl,
            emailId,
            recipients
        } = data;

        logging.info(`[Loops] Sending email to ${recipients.length} recipients (emailId: ${emailId})`);
        const startTime = Date.now();
        debug(`[Loops] sending message to ${recipients.length} recipients`);

        const transactionalId = this.#transactionalId || process.env.LOOPS_TRANSACTIONAL_ID;

        try {
            const sendPromises = recipients.map(async (recipient) => {
                const recipientVariables = recipient.replacements.reduce((acc, replacement) => {
                    acc[replacement.id] = replacement.value;
                    return acc;
                }, {});

                // If transactional ID is available in Loops, trigger transactional email with dataVariables
                if (transactionalId) {
                    return await this.#request('/transactional', {
                        transactionalId,
                        email: recipient.email,
                        dataVariables: {
                            subject: subject || '',
                            htmlContent: html || '',
                            textContent: plaintext || '',
                            fromEmail: from || '',
                            replyTo: replyTo || '',
                            ...recipientVariables,
                            firstName: recipientVariables.firstName || recipientVariables.first_name || 'there',
                            postUrl: getTrackedPostUrl(postUrl, recipient.email) || ''
                        }
                    });
                }

                // Otherwise, create or update contact in Loops with userGroup
                return await this.#request('/contacts/create', {
                    email: recipient.email,
                    subscribed: true,
                    userGroup: this.#userGroup || 'Newsletter',
                    source: 'Ghost Newsletter',
                    ...recipientVariables
                }).catch(async (err) => {
                    // If contact already exists (409 / already created), update contact
                    return await this.#request('/contacts/update', {
                        email: recipient.email,
                        subscribed: true,
                        userGroup: this.#userGroup || 'Newsletter',
                        ...recipientVariables
                    }).catch(() => {});
                });
            });

            await Promise.all(sendPromises);

            const elapsed = Date.now() - startTime;
            debug(`[Loops] Sent message (${elapsed}ms)`);
            logging.info(`[Loops] Sent message to ${recipients.length} recipients in ${elapsed}ms`);

            return {
                id: `loops-${emailId || Date.now()}`
            };
        } catch (e) {
            if (this.#errorHandler) {
                this.#errorHandler(e);
            }
            debug(`[Loops] failed to send message:`, e);
            throw e;
        }
    }

    getMaximumRecipients() {
        return 1000;
    }

    /**
     * Returns the configured delay between batches in milliseconds
     * @returns {number}
     */
    getTargetDeliveryWindow() {
        return 0;
    }
}

module.exports = LoopsEmailProvider;
