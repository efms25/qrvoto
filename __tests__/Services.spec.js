import { addElections, getElections } from "../src/Core/Services"


test('Services Tests', () => {
    it("Deve cadastrar um pleito.", (done) => {
        addElections({
            year: 2018,
            shift: 1
        })
        getElections().then(data => {
            expect(data.length).toBe(1)
            console.log(data)
            done()
        })
    })
})