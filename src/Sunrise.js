/*  Calculations based on:
    [*1]http://www.navipedia.pl/,
    [*2]"Astronomiczne oblicznenia nie tylko dla geografów" by Kazimierz Borkowski Uniwersytet Mikołaja Kopernika w Toruniu, Toruń 1991.
    [*3]http://www.cs.utsa.edu/~cs1063/projects/Spring2011/Project1/jdn-explanation.html
    [*4]http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
    [*5]http://aa.usno.navy.mil/faq/docs/GAST.php
    [*6]http://books.google.pl/books?id=ZnNrepLivYEC&lpg=PA17&ots=tmzu0w_Opi&dq=GMST%200hUT&hl=pl&pg=PA17#v=onepage&q=GMST%200hUT&f=false

    alpha - Right ascension (rektasencja)
    sigma - Declination (deklinacja)
    phi - latitude (szerokość geograficzna)
 */

function sunrise() {
    var that = {};

    /*returns: Number of days calculated since noon on January 1, 4713 BCE.*/
    that.toJD = function (date) {
        var Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate();

        if (M <= 2) {
            Y -= 1;
            M += 12;
        }
        //Calc. leap years
        var A = Math.floor(Y / 100);
        var B = Math.floor(A / 4);
        var C = 2 - A + B;//valid only for dates after 1.10.1582
        var E = Math.floor(365.25 * (Y + 4716));
        var F = Math.floor(30.6001 * (M + 1));

        return C + D + E + F - 1524.5;
    };

    that.calcGMST = function (date) {
        var H = 12;
        var jd0 = that.toJD(date);
        //TODO: To calculate GMST at UT other than 0 use time to calculate value
        var jd = jd0 + H / 24;
        var d = jd - 2451545.0;
        var d0 = jd0 - 2451545.0;
        var t = d / 36525;

        /*Alternative method, but less exact according to tables from [*6] and description from [*5]:
         //GMST2
         var GMST = 18.697374558 + 24.06570982441908 * d;
         //GMST2
         return (GMST % 24) - 12;
         */

        //GMST
        var GMST = 6.697374558 + 0.06570982441908 * d0 + 0.000026 * (t * t);
        //Normalize to [0-24]
        return GMST % 24;
    };



    return that;
}

var s = sunrise();