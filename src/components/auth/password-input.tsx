"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder: string;
  required?: boolean;
  inputClassName: string;
  wrapperClassName: string;
  iconClassName: string;
  toggleButtonClassName: string;
};

export function PasswordInput({
  id,
  name,
  placeholder,
  required,
  inputClassName,
  wrapperClassName,
  iconClassName,
  toggleButtonClassName,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={wrapperClassName}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Lock className={iconClassName} />
      </div>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        placeholder={placeholder}
        className={inputClassName}
      />
      <button
        type="button"
        aria-label={visible ? "隐藏密码" : "显示密码"}
        onClick={() => setVisible((current) => !current)}
        className={toggleButtonClassName}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
