/**
 * Options for the RemoveId decorator
 */
export interface RemoveIdOptions {
  /**
   * Whether to remove Id from input arguments
   * @default false
   */
  processInputs?: boolean;
  
  /**
   * Whether to remove Id from return value
   * @default true
   */
  processOutput?: boolean;
}

/**
 * Decorator that removes Id field from objects before creation.
 * Can be applied to any method that returns an object or array of objects.
 * @param options Configuration options
 */
export function RemoveId(options: RemoveIdOptions = {}) {
    const { 
        processInputs = false, 
        processOutput = true 
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
                ? args.map(arg => removeIdFromData(arg)) 
                : args;
            
            const result = originalMethod.apply(this, processedArgs);

            // Process output if enabled
            if (!processOutput) {
                return result;
            }
            
            // Handle promises
            if (result instanceof Promise) {
                return result.then((data) => removeIdFromData(data));
            }

            return removeIdFromData(result);
        };

        return descriptor;
    };
}

/**
 * Wrapper function that can be used with standalone functions to remove Id fields
 * @param fn The function to wrap
 * @param options Configuration options
 * @returns A new function that removes Id fields
 */
export function removeIdFromFunction<T extends (...args: any[]) => any>(
    fn: T, 
    options: RemoveIdOptions = {}
): T {
    const { 
        processInputs = false, 
        processOutput = true 
    } = options;
    
    return ((...args: Parameters<T>): ReturnType<T> => {
        // Process input arguments if enabled
        const processedArgs = processInputs 
            ? args.map(arg => removeIdFromData(arg)) 
            : args;
            
        const result = fn(...processedArgs);

        // Process output if enabled
        if (!processOutput) {
            return result as ReturnType<T>;
        }
        
        // Handle promises
        if (result instanceof Promise) {
            return result.then((data) => removeIdFromData(data)) as ReturnType<T>;
        }

        return removeIdFromData(result) as ReturnType<T>;
    }) as T;
}

/**
 * Removes Id fields from the provided data
 * Works with single objects, arrays, and nested objects
 */
function removeIdFromData(data: any): any {
    if (!data) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map((item) => removeIdFromData(item));
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
        const newObj = { ...data };

        // Remove Id fields (case-insensitive)
        delete newObj.Id;
        delete newObj.id;

        // Process nested objects
        for (const key in newObj) {
            if (typeof newObj[key] === 'object' && newObj[key] !== null) {
                newObj[key] = removeIdFromData(newObj[key]);
            }
        }

        return newObj;
    }

    return data;
}
