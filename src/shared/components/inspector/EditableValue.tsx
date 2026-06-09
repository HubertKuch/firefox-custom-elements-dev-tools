import { useState, useRef, useEffect, JSX } from 'preact/compat';

interface EditableValueProps {
    initialValue: string;
    onSave: (newValue: string) => void;
    className?: string;
}

export const EditableValue = ({ initialValue, onSave, className = "" }: EditableValueProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync state if initialValue changes from outside
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // Select all text when entering edit mode
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== initialValue) {
            onSave(value);
        }
    };

    const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (value !== initialValue) {
                onSave(value);
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setValue(initialValue); // Revert
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue((e.target as HTMLInputElement).value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`bg-white dark:bg-[#1a1a1a] text-black dark:text-white border border-blue-500 rounded-sm px-1 py-0 outline-none w-full max-w-full ${className}`}
            />
        );
    }

    return (
        <span 
            onDblClick={handleDoubleClick} 
            className={`cursor-text border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded-sm px-1 -mx-1 truncate ${className}`}
            title="Double click to edit"
        >
            "{value}"
        </span>
    );
};