import { expect } from "chai";

describe('Arrays', ()=>{
    describe("sort", ()=>{
        it('Sort not sorted names array', ()=>{
            var names = ['Dani', 'Moshe', 'Adam'];
            expect(names.sort()).to.be.eql(['Adam', 'Dani', 'Moshe']);
        })
    })

})