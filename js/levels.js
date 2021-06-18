// {...tileOb, icon: " ", points : "", static : true, type: 0},
// {...tileOb, icon: "←", points : "L", static : true, type: 1},
// {...tileOb, icon: "↑", points : "T", static : true, type: 2},
// {...tileOb, icon: "→", points : "R", static : true, type: 3},
// {...tileOb, icon: "↓", points : "B", static : true, type: 4},

// {...tileOb, icon: "│", points : "TB", type: 5},
// {...tileOb, icon: "─", points : "LR", type: 6},

// {...tileOb, icon: "┘", points : "LT", type: 7},
// {...tileOb, icon: "└", points : "RT", type: 8},
// {...tileOb, icon: "┌", points : "RB", type: 9},
// {...tileOb, icon: "┐", points : "LB", type: 10},

// {...tileOb, icon: "┤", points : "LTB", type: 11},
// {...tileOb, icon: "┴", points : "LRT", type: 12},
// {...tileOb, icon: "├", points : "RTB", type: 13},
// {...tileOb, icon: "┬", points : "LRB", type: 14},

// {...tileOb, icon: "┼", points : "LRTB", type: 15},

// {...tileOb, icon: "◄", points : "L", static : true, type: 16},
// {...tileOb, icon: "▲", points : "T", static : true, type: 17},
// {...tileOb, icon: "►", points : "R", static : true, type: 18},
// {...tileOb, icon: "▼", points : "B", static : true, type: 19},

// {...tileOb, icon: "╥", points: "B", static : true, type: 20},
// {...tileOb, icon: "╡", points: "L", static : true, type: 21},
// {...tileOb, icon: "╨", points: "T", static : true, type: 22},
// {...tileOb, icon: "╞", points: "R", static : true, type: 23},
//
// {...tileOb, icon: "●", static : true, type: 30},

export default [
    {
        pattern: [
            ["→┌┌┴●"],
            ["● ┌│●"],
            ["●┌│┌●"],
            ["●┌┌┌◄"],
        ],
        missed: "─"
    },
    {
        pattern: [
            ["┌│││╡"],
            ["┌─┌│┌"],
            ["┌┌│┌┌"],
            ["→│ │◄"],
        ],
        missed: "┬"
    },
    {
        pattern: [
            ["↓●┌◄╥"],
            ["┌┌┌│┤"],
            ["└  └┌"],
            ["┌●┌┌┌"],
        ],
        missed: "┌┌"
    },
    {
        pattern: [
            ["→┌┌│╡"],
            ["┌│ │╡"],
            ["╞┼ │╡"],
            ["╞┌ ┌┌"],
            ["╞│┌┌◄"],
        ],
        missed: "┤┤┼"
    },
    {
        pattern: [
            ["┌│┌  ┌┌"],
            ["┌┌┌●●┌┌"],
            ["┌┌┌●┌┌┌"],
            ["┌┌┌●│┌ "],
            ["→┌┌●┌┌▲"],
        ],
        missed: "──┐"
    },
    {
        pattern: [
            ["└┐─│┐┤┼┤"],
            ["┌ ┬ ┌●┌┌"],
            ["┌┌●┌│┌┌┌"],
            ["┌┌←┌┌●┌│"],
            ["┐┌┌┐ ┌┌┌"],
            ["┌└│─▲┌┌╨"],
        ],
        missed: "──┐┤"
    }
]