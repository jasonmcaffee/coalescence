require('core-js/fn/object/entries');//polyfill for Object.entries method

/**
 * Combines sources together into one object which is returned after deep merging has completed.
 * The last source param overrides the previous (i.e. defaults should be passed first)
 * @param sources - rest param for all sources which should be coalesced/merged together.
 * @returns {{}} - an object with all properties from the passed in sources.
 */
const coalescence = (...sources)=>{
    if(!sources || !(sources.length > 0)){ return; }
    let result = {};

    for(const source of sources){
        deepMerge(result, source);
    }

    return result;
};

/**
 * Iterates over each source property and copies it to the target.
 * If the source property value is an object, each property of the value will be copied to the target property
 * @param target - source properties are copied into this object
 * @param source - all properties will be copied from this into target. function context for get/set/function will be maintained.
 * @returns {*|{}}
 */
const deepMerge = (target, source)=>{
    if(!source){ return; }//Object.entries throws error if source is undefined
    target = target || {};

    for(const [key, value] of Object.entries(source)){
        //get the property descriptor and clone it, so we can modify the value without any side affects.
        let sourcePropertyDescriptorForKeyClone = Object.getOwnPropertyDescriptor(source, key);
        //let sourcePropertyDescriptorForKeyClone = clone(sourcePropertyDescriptorForKey);
        let mergedValue;
        //console.log(`key: ${key} has sourcePropertyDescription: ${sourcePropertyDescriptorForKeyClone}`);
        switch(typeof(value)){
            case 'object':
                if(typeof value[Symbol.iterator] === 'function'){
                    mergedValue = cloneIterable(value);
                }else{
                    mergedValue = deepMerge(target[key], value);
                }
                break;
            default:
                mergedValue = value;
                break;
        }

        //set the value of the descriptor so that the original value is not passed into Object.defineProperty (if so then it will have the value passed in)
        //Avoid TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>
        if(typeof(sourcePropertyDescriptorForKeyClone.get) === "undefined"){
            sourcePropertyDescriptorForKeyClone.value = mergedValue;
        }

        Object.defineProperty(target, key, sourcePropertyDescriptorForKeyClone);
    }
    return target;
};

const clone = objectToClone => deepMerge(undefined, objectToClone);

const cloneIterable = arrayToClone =>{
    return arrayToClone.map(deepMerge);
};

module.exports = coalescence;