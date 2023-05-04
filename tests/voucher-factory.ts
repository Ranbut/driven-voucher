import { faker } from "@faker-js/faker";

function createVoucherFactory(){
    const voucher  = {
        id: faker.datatype.number({min:1}),
        code: faker.random.alphaNumeric(16),
        discount : faker.datatype.number({min: 1, max:100}),
        used : false
    }
    return voucher
};

function generateValue(min: number, max: number){
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export default {
    createVoucherFactory,
    generateValue,
}