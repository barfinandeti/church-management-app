'use client';

interface Church {
    id: string;
    name: string;
}

interface ChurchSelectorProps {
    churches: Church[];
    defaultValue?: string;
    name?: string;
    label?: string;
    required?: boolean;
    className?: string;
}

export default function ChurchSelector({
    churches,
    defaultValue,
    name = 'churchId',
    label = 'Select Church',
    required = true,
    className = '',
}: ChurchSelectorProps) {
    if (!churches || churches.length === 0) return null;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {label}
            </label>
            <select
                name={name}
                defaultValue={defaultValue || ''}
                required={required}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="" disabled>
                    -- Select a Church --
                </option>
                {churches.map((church) => (
                    <option key={church.id} value={church.id}>
                        {church.name}
                    </option>
                ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
                Content will be posted to this church's portal.
            </p>
        </div>
    );
}
