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

    describe("GMST calculation", function(){
        //Astronomical Phenomena for the Year 2012:
        //http://books.google.pl/books?id=ZnNrepLivYEC&lpg=PA17&ots=tmzu0w_Opi&dq=GMST%200hUT&hl=pl&pg=PA17#v=onepage&q=GMST%200hUT&f=false
        describe("according to tables from the Astronomical Phenomena for the Year 2012", function(){
            var valuesAt0 = [6.6050, 8.6420, 10.5476, 12.5846, 14.5559, 16.5929, 18.5642, 20.6012, 22.6382, 0.6095, 2.6465, 4.6178];
            var tabledGMST = function(day, month){
                return valuesAt0[month] + 0.06571 * day;
            };

            it("should be valid for 1st, 3rd, 24th, 28th of January 2012", function(){
                for( var d in [1,3,24,28] ){
                    var val = sunriser.calcGMST(new Date(Date.UTC(2012, 0, d)));
                    expect(val).toBeCloseTo(tabledGMST(d,0));
                }
            });

            it("should be valid for 1st, 3rd, 24th, 28th of September 2012", function(){
                for( var d in [1,3,24,28] ){
                    var val = sunriser.calcGMST(new Date(Date.UTC(2012, 8, d)));
                    expect(val).toBeCloseTo(tabledGMST(d,8));
                }
            });

            it("should be valid for 1st, 5th, 7th, 9th, 22nd, 25th and 29th of December 2012", function(){
                for( var d in [1,5,7,9,22,25,29] ){
                    var val = sunriser.calcGMST(new Date(Date.UTC(2012, 11, d)));
                    expect(val).toBeCloseTo(tabledGMST(d,11));
                }
            });
        });
    });

    describe("Sunrise and sunset calculation", function(){
        it("Should calculate sunrise and sunset time for March, 18th 2012 in Krakow (50°3′41″N 19°56′18″E)", function(){
            console.log(sunriser.sunTimes({d:50, m:3, s:41}, new Date(Date.UTC(2012, 2, 18))));
        })
    });
});
