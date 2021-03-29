import React from 'react';
import styles from './text-input.module.css';

interface ITextInputProps {
  name: string;
  value: string;
  type?: 'text' | 'number';
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function TextInput(props: ITextInputProps) {
  const { type = 'text', name, onChange, value, placeholder = '' } = props;
  return (
    <div className={styles.textWrapper}>
      <input
        placeholder={placeholder}
        value={value}
        name={name}
        type={type}
        className={styles.input}
        onChange={onChange}
      />
    </div>
  );
}

export default TextInput;
