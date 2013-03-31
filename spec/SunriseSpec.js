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

    describe("Units converter", function(){
        beforeEach(function() {
            this.addMatchers({
                toBeLike: function(expected) {
                    var actual = this.actual;
                    var notText = this.isNot ? " not" : "";
                    //fault tolerance in minutes
                    var result = true;
                    for( var field in expected ){
                        if(expected.hasOwnProperty(field)){
                            //Checking if fields have the same value
                            //if expected field is a number we chec if both fields (actual and expected) are number
                            //and if so we use Math.round() and check if values are equal. If round on actual field returns NaN it's false.
                            if(
                                ((actual[field] !== expected[field]) &&
                                ((typeof expected[field]) !== "number")) ||
                                ((typeof actual[field] !== typeof expected[field])) ||
                                 (!isFinite(Math.round(actual[field]))) ||
                                 (Math.round(actual[field]) !== Math.round(expected[field]))
                               ){

                                var actual_text = (typeof actual[field]) + " acutal[" + field + "] = " + actual[field];
                                var expected_text = (typeof expected[field]) + " expected[" + field + "] = " + expected[field];
                                result = false;
                                break;
                            }
                        }
                    }

                    this.message = function () {
                        return "Expected " + actual_text + notText + " to be like " + expected_text;
                    };
                    return result;
                }
            });
        });

        it("Should convert decimal degrees value to radians", function(){

            var tests = [[-90, -Math.PI/2],[0,0], [16.0,0.27925268], [90,1.570796327], [270,4.71238898], [360,2*Math.PI]];
            for( var i = 0; i<tests.length; i++ ){
                var x = tests[i][0];
                var val = sunriser.converter.decToRad(x);
                expect(val).toBeCloseTo(tests[i][1]);
                expect(sunriser.converter.radToDec(val)).toBeCloseTo(x);
            }
        });

        it("Should convert time to degree value", function(){
            var tests = [
                [{h: 12, m: 0, s: 0}, {d: 180, m: 0, s: 0}],
                [{h: 23, m: 30, s: 30}, {d: 352, m: 37, s: 30}]
            ];
            for( var i = 0; i<tests.length; i++ ){
                var x = tests[i][0];
                var val = sunriser.converter.timeToDeg(x);
                expect(val).toBeLike(tests[i][1]);
                expect(sunriser.converter.degToTime(val)).toBeLike(tests[i][0]);
            }
        });


        it("Should convert degrees to decimal value", function(){
            var tests = [
                [{d: 0, m: 0, s: 0}, 0],
                [{d: 360, m: 0, s: 0}, 360],
                [{d: 123, m: 56, s: 32}, 123.9422222222]
            ];
            for( var i = 0; i<tests.length; i++ ){
                var x = tests[i][0];
                var val = sunriser.converter.degToDec(x);
                expect(val).toBeCloseTo(tests[i][1]);
            }
        });

        it("Should convert decimal degrees to time", function(){
            var tests = [
                [360, {h: 24, m: 0, s: 0}],
                [180.5, {h: 12, m: 2, s: 0}],
                [187.5625, {h: 12, m: 30, s: 15}]
            ];
            for( var i = 0; i<tests.length; i++ ){
                var x = tests[i][0];
                var val = sunriser.converter.decToTime(x);
                expect(val).toBeLike(tests[i][1]);
            }
        });

    });

    describe("Sunrise and sunset calculation in UTC", function(){
        beforeEach(function() {
            this.addMatchers({
                toBeAroundTime: function(expected) {
                    var actual = this.actual;
                    var notText = this.isNot ? "do not" : "";

                    var helperConverter = function(time){
                        return time.h + time.m / 60 + (time.s ? time.s / 3600 : 0);
                    };

                    //fault tolerance in minutes
                    var tolerance_min = 1;

                    this.message = function () {
                        return ("Expected sunrise at " + actual.rise.h + ":" + actual.rise.m + " or sunset at " + actual.set.h + ":" + actual.set.m +
                            notText + " match " + expected.rise.h + ":" + expected.rise.m + " or sunset at " +  + expected.set.h + ":" + expected.set.m + " with tolerance " + tolerance_min + " min");
                    };

                    var actual_rise_hours = helperConverter(actual.rise);
                    var actual_set_hours = helperConverter(actual.set);
                    var expected_rise_hours = helperConverter(expected.rise);
                    var expected_set_hours = helperConverter(expected.set);

                    return (actual_rise_hours >= (expected_rise_hours - (tolerance_min / 60))) &&
                           (actual_rise_hours <= (expected_rise_hours + (tolerance_min / 60))) &&
                           (actual_set_hours >= (expected_set_hours - (tolerance_min / 60))) &&
                           (actual_set_hours <= (expected_set_hours + (tolerance_min / 60)));
                }
            });
        });
        //times obtained from various sites around the internet.
        it("should calculate sunrise and sunset time for March, 18th 2012 in Krakow (50,3,41N 19,56,18E)", function(){
            sunriser.
                setDate(new Date(Date.UTC(2012, 2, 18))).
                setLocation({"latitude":{d:50, m:3, s:41}, "longitude":{d:19, m:56, s:18}});

            var res = sunriser.getTimes();
            expect(res).toBeAroundTime({rise: {h: 4, m: 47} ,set: {h: 16, m: 51}});
            //console.log(sunriser.sunTimes({d:50, m:3, s:41}, new Date(Date.UTC(2012, 2, 18))));
        });

        it("Should calculate sunrise and sunset time for September, 22nd 2015 in San Francisco (37,46,45N 122,25,09,W)", function(){
            sunriser.
                setDate(new Date(Date.UTC(2015, 8, 22))).
                setLocation({"latitude":{d:37, m:36, s:45}, "longitude":{d:-122, m:-25, s:-9}});

            var res = sunriser.getTimes();
            expect(res).toBeAroundTime({rise: {h: 13, m: 57} ,set: {h: 2, m: 7}});
        });

        it("Should calculate sunrise and sunset time for December, 25th 2027 in Auckland (36,51S 174,47E)", function(){
            sunriser.
                setDate(new Date(Date.UTC(2027, 11, 25))).
                setLocation({"latitude":{d:-36, m:-51, s:0}, "longitude":{d:174, m:47, s:0}});

            var res = sunriser.getTimes();
            expect(res).toBeAroundTime({rise: {h: 17, m: 00} ,set: {h: 7, m: 41}});
        })
    });
});
