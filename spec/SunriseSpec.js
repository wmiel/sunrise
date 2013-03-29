describe("Sunrise library", function () {
    var sunriser = sunrise();

    it("should be defined", function () {
        expect(sunriser).toBeDefined();
    });

    describe("Julian day conversion", function () {
        it("should return correct number of days since January 1, 4713 BCE for January 1, 2000", function(){

            var calculated = sunriser.toJD(new Date(Date.UTC(2000, 0, 1)));
            expect(calculated).toEqual(2451544.5);
        });
        it("should return correct number of days since January 1, 4713 BCE for January 1, 1970", function(){

            var calculated = sunriser.toJD(new Date(Date.UTC(1970, 0, 1)));
            expect(calculated).toEqual(2440587.5);
        });
        it("should return correct number of days since January 1, 4713 BCE for March 18, 2020", function(){

            var calculated = sunriser.toJD(new Date(Date.UTC(2020, 2, 18)));
            expect(calculated).toEqual(2458926.5);
        });
        it("should return correct number of days since January 1, 4713 BCE for November 22, 2089", function(){

            var calculated = sunriser.toJD(new Date(Date.UTC(2089, 10, 22)));
            expect(calculated).toEqual(2484377.5);
        });
        it("should return correct number of days since January 1, 4713 BCE for February 29, 2004", function(){

            var calculated = sunriser.toJD(new Date(Date.UTC(2004, 1, 29)));
            expect(calculated).toEqual(2453064.5);
        });
    });
});