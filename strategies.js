var strategies = {
    "ONE":{
        description: "always ask for one leaf",
        call : function(hist) {
            return 1
        },
        wins:0,
        loses:0
    },
    "repeat last":{
        description: "repeat last player choice",
        call : function(hist) {
            if (hist.length == 0) {
                return 1
            };
            return hist[hist.length - 1].asked
        },
        wins:0,
        loses:0,

    },
}