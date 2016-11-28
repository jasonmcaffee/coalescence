const coalescence = require('./../build/coalescence');

describe("coalescence", ()=>{

    it("should provide deep defaults/merge functionality", ()=>{

        let defaults = {
            name:{
                first: 'unknown',
                last: 'unknown'
            }
        };

        let person = {
            name: {
                first: 'jim',
                last: 'halpert'
            },
            sex: 'male'
        };

        let result = coalescence(defaults, person);

        expect(result.name).toEqual(person.name);
        expect(result.sex).toEqual(person.sex);

        //mutations of one should not affect the other
        person.name.first = 'pam';
        expect(result.name.first).toEqual('jim');

    });


    it("should maintain context for accesssors, mutators, and functions", ()=>{
        let dunderMifflinEmployee = {
            name:{
                first: 'unknown',
                last:'unknown'
            },
            get fullName(){
                return `${this.name.first} ${this.name.last}`;
            },
            set fullName(fullName){
                const [first, last] = fullName.split(' ');
                this.name.first = first;
                this.name.last = last;
            },
            getFullName: function(){
                return `${this.name.first} ${this.name.last}`;
            }
        };

        let person = {
            name: {
                first: 'jim',
                last: 'halpert'
            }
        };

        let result = coalescence(dunderMifflinEmployee, person);

        expect(result.fullName).toEqual(`${person.name.first} ${person.name.last}`);
        expect(result.getFullName()).toEqual(result.fullName);

        result.fullName = 'pam beesly';
        expect(result.name.first).toEqual('pam');
        expect(result.name.last).toEqual('beesly');
    });

    fit("should merge property descriptors", ()=>{
        let defaults = {};
        let defaultNamePropertyDescriptor = {
            value: {first: 'unknown', last:'unknown'},
            writable: false,
            enumerable: true  //properties must be enumerable on objects if they are to be carried over.
        };
        Object.defineProperty(defaults, 'name', defaultNamePropertyDescriptor);

        expect(Object.entries(defaults).length >=1).toEqual(true);

        let person = {};
        let namePropertyDescriptor = {
            value: { first: 'pam' , last: 'beesly' },
            writable: false,
            enumerable: true
        };
        Object.defineProperty(person, 'name', namePropertyDescriptor);

        let originalPropertyDescriptor = Object.getOwnPropertyDescriptor(person, 'name');
        let result = coalescence(defaults, person);
        let clonePropertyDescriptor = Object.getOwnPropertyDescriptor(result, 'name');

        expect(clonePropertyDescriptor).toEqual(originalPropertyDescriptor);//ensure all property values are equal.
        expect(defaultNamePropertyDescriptor).not.toEqual(originalPropertyDescriptor);
        expect(clonePropertyDescriptor === originalPropertyDescriptor).toEqual(false);//ensure not the same reference

        let result2 = coalescence(defaults);
        let result2Descriptor = Object.getOwnPropertyDescriptor(result2, 'name');
        let defaultsPropertyDescriptor = Object.getOwnPropertyDescriptor(defaults, 'name');
        expect(result2Descriptor).toEqual(defaultsPropertyDescriptor);



    });

    //it("should provide an api for mapping, filtering, etc", ()=>{
    //
    //    let dunderMifflinEmployee = {
    //        name:{
    //            first: 'unknown',
    //            last:'unknown'
    //        },
    //        employer: {
    //            name: 'Dunder Mifflin',
    //            ein: 'XX-XXXXXXX'
    //        }
    //    };
    //
    //    let person = {
    //        name: {
    //            first: 'jim',
    //            last: 'halpert'
    //        }
    //    };
    //
    //    coalescence
    //        .filter((target, source, propertyName, propertyValue, root)=>{}) //return true to include
    //        .map((target, source, propertyName, propertyValue, root)=>{})
    //        (dunderMifflinEmployee, person);
    //});
});