import React from 'react';
import styles from './buttonSb.module.css';

export interface ButtonSbProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const ButtonSb = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonSbProps) => {
  const mode = primary ? styles.primarySb : styles.secondarySb;
   return (
    <button
      type="button"
      className={`${styles.buttonSb} ${styles[size + "Sb"]} ${mode}`}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};