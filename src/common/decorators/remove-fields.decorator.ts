/**
 * Options for the RemoveFields decorator
 */
export interface RemoveFieldsOptions {
    /**
     * Whether to remove fields from input arguments
     * @default false
     */
    processInputs?: boolean;

    /**
     * Whether to remove fields from return value
     * @default true
     */
    processOutput?: boolean;

    /**
     * List of field names to remove
     * @default ['id', 'Id']
     */
    fields?: string[];
}

/**
 * Decorator that removes specified fields from objects.
 * Can be applied to any method that returns an object or array of objects.
 * @param options Configuration options
 */
export function RemoveFields(options: RemoveFieldsOptions = {}) {
    const {
        processInputs = false,
        processOutput = true,
        fields = ['id', 'Id']
    } = options;

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Process input arguments if enabled
            const processedArgs = processInputs
                ? args.map(arg => removeFieldsFromData(arg, fields))
                : args;

            const result = originalMethod.apply(this, processedArgs);

            // Process output if enabled
            if (!processOutput) {
                return result;
            }

            // Handle promises
            if (result instanceof Promise) {
                return result.then((data) => removeFieldsFromData(data, fields));
            }

            return removeFieldsFromData(result, fields);
        };

        return descriptor;
    };
}

/**
 * For backward compatibility
 * Decorator that removes Id field from objects
 */
export function RemoveId(options: Omit<RemoveFieldsOptions, 'fields'> = {}) {
    return RemoveFields({ ...options, fields: ['id', 'Id'] });
}

/**
 * Decorator that removes common auto-generated date fields from objects.
 * Removes 'createdAt', 'updatedAt', 'created_at', 'updated_at', 'createDate', 'updateDate' by default.
 * @param options Configuration options (excluding fields which are predefined)
 */
export function RemoveAutoDates(options: Omit<RemoveFieldsOptions, 'fields'> = {}) {
    const dateFields = [
        'createdAt', 
        'updatedAt', 
        'created_at', 
        'updated_at', 
        'createDate', 
        'updateDate'
    ];
    
    return RemoveFields({ 
        ...options, 
        fields: dateFields 
    });
}

/**
 * Wrapper function for standalone functions to remove common auto-generated date fields.
 * @param fn The function to wrap
 * @param options Configuration options (excluding fields which are predefined)
 */
export function removeAutoDatesFromFunction<T extends (...args: any[]) => any>(
    fn: T,
    options: Omit<RemoveFieldsOptions, 'fields'> = {}
): T {
    const dateFields = [
        'createdAt', 
        'updatedAt', 
        'created_at', 
        'updated_at', 
        'createDate', 
        'updateDate'
    ];

    return removeFieldsFromFunction(fn, {
        ...options,
        fields: dateFields
    });
}

/**
 * Wrapper function that can be used with standalone functions to remove specified fields
 * @param fn The function to wrap
 * @param options Configuration options
 * @returns A new function that removes specified fields
 */
export function removeFieldsFromFunction<T extends (...args: any[]) => any>(
    fn: T,
    options: RemoveFieldsOptions = {}
): T {
    const {
        processInputs = false,
        processOutput = true,
        fields = ['id', 'Id']
    } = options;

    return ((...args: Parameters<T>): ReturnType<T> => {
        // Process input arguments if enabled
        const processedArgs = processInputs
            ? args.map(arg => removeFieldsFromData(arg, fields))
            : args;

        const result = fn(...processedArgs);

        // Process output if enabled
        if (!processOutput) {
            return result as ReturnType<T>;
        }

        // Handle promises
        if (result instanceof Promise) {
            return result.then((data) => removeFieldsFromData(data, fields)) as ReturnType<T>;
        }

        return removeFieldsFromData(result, fields) as ReturnType<T>;
    }) as T;
}

/**
 * For backward compatibility
 * Wrapper function that can be used with standalone functions to remove Id fields
 */
export function removeIdFromFunction<T extends (...args: any[]) => any>(
    fn: T,
    options: Omit<RemoveFieldsOptions, 'fields'> = {}
): T {
    return removeFieldsFromFunction(fn, { ...options, fields: ['id', 'Id'] });
}

/**
 * Removes specified fields from the provided data
 * Works with single objects, arrays, and nested objects
 * @param data The data to process
 * @param fields Array of field names to remove
 */
function removeFieldsFromData(data: any, fields: string[]): any {
    if (!data) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map((item) => removeFieldsFromData(item, fields));
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
        const newObj = { ...data };

        // Remove specified fields
        for (const field of fields) {
            delete newObj[field];
        }

        // Process nested objects
        for (const key in newObj) {
            if (typeof newObj[key] === 'object' && newObj[key] !== null) {
                newObj[key] = removeFieldsFromData(newObj[key], fields);
            }
        }

        return newObj;
    }

    return data;
}
