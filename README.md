# coalescence
Provides deep mixin/merge/extend functionality, which is useful for situations where you need defaults or composition.

## Example
### Defaults
```
let dunderMifflinEmployee = {
    name:{
        first: 'unknown',
        last:'unknown'
    },
    employer: {
        name: 'Dunder Mifflin',
        ein: 'XX-XXXXXXX'
    }
};

let person = {
    name: {
        first: 'jim',
        last: 'halpert'
    },
    employer: {}
};

let employeeJimHalpert = coalescence(dunderMifflinEmployee, person);

expect(employeeJimHalpert.name).toEqual(person.name);
expect(employeeJimHalpert.employer).toEqual(dunderMifflinEmployee.employer);

```