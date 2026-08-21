import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-2.5">
      {/* Label with selected value — like Keyzar: "Type: Polished" */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium text-gray-900 tracking-wide">
          {title}:
        </span>
        {current && (
          <span className="text-xs text-gray-500 font-light">{current}</span>
        )}
      </div>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border text-xs h-10 px-4 min-w-[60px] transition-all duration-200 font-light",
                {
                  "border-gray-900 bg-white text-gray-900 font-normal": v === current,
                  "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
