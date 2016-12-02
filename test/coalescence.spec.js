const coalescence = require('./../build/coalescence');

describe("coalescence", ()=>{

    it("should provide deep defaults/merge functionality", ()=>{
        let arrayItem1 = {item: 1};
        let arrayItem2 = {item: 2};

        let defaults = {
            name:{
                first: 'unknown',
                last: 'unknown'
            },
            items:[
                arrayItem2,
                arrayItem1
            ]
        };

        let person = {
            name: {
                first: 'jim',
                last: 'halpert'
            },
            items:[
                arrayItem1
            ],
            sex: 'male'
        };

        let result = coalescence(defaults, person);

        expect(result.name).toEqual(person.name);
        expect(result.sex).toEqual(person.sex);
        expect(result.items.length).toEqual(1);
        expect(result.items[0].item).toEqual(arrayItem1.item);

        //mutations of one should not affect the other
        person.name.first = 'pam';
        expect(result.name.first).toEqual('jim');

        arrayItem1.item = 'abcd';
        expect(result.items[0].item).not.toEqual(arrayItem1.item);

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
        expect(person.fullName).not.toEqual('pam beesly');
    });

    it("should merge property descriptors", ()=>{
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