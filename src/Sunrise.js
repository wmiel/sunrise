/*  Calculations based on http://www.navipedia.pl/
    and "Astronomiczne oblicznenia nie tylko dla geografów" by by Kazimierz Borkowski
    Uniwersytet Mikołaja Kopernika w Toruniu, Toruń 1991.

 http://www.cs.utsa.edu/~cs1063/projects/Spring2011/Project1/jdn-explanation.html
 http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html

    alpha - Right ascension (rektasencja)
    sigma - Declination (deklinacja)
    phi - latitude (szerokość geograficzna)

    Dates in js since epoch January 1 1970.
    January 1, 2000 = 2451545
    Julian dates calculated since noon on January 1, 4713 BCE.

 */

function sunrise() {
    var that = {};

    that.toJD = function (date) {
        var Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            A,
            B,
            C,
            E,
            F;

        if (M <= 2) {
            Y -= 1;
            M += 12;
        }

        //Calc. leap years
        A = Math.floor(Y / 100);
        B = Math.floor(A / 4);
        C = 2 - A + B;//valid only for dates after 1.10.1582
        E = Math.floor(365.25 * (Y + 4716));
        F = Math.floor(30.6001 * (M + 1));

        console.log(date);
        console.log(C + D + E + F - 1524.5);
        return C + D + E + F - 1524.5;
    };

    return that;
}