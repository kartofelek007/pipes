/*
{...tileOb, icon: "x", points: "", inactive: true, type: -1},
{...tileOb, icon: " ", points: "", inactive: true, type: 0},


{...tileOb, icon: "←", points: "L", inactive: true, type: 1, types: [1, 2, 3, 4]},
{...tileOb, icon: "↑", points: "T", inactive: true, type: 2, types: [1, 2, 3, 4]},
{...tileOb, icon: "→", points: "R", inactive: true, type: 3, types: [1, 2, 3, 4]},
{...tileOb, icon: "↓", points: "B", inactive: true, type: 4, types: [1, 2, 3, 4]},

{...tileOb, icon: "│", points: "TB", type: 5, types: [5, 6]},
{...tileOb, icon: "─", points: "LR", type: 6, types: [5, 6]},

{...tileOb, icon: "┘", points: "LT", type: 7, types: [7, 8, 9, 10]},
{...tileOb, icon: "└", points: "RT", type: 8, types: [7, 8, 9, 10]},
{...tileOb, icon: "┌", points: "RB", type: 9, types: [7, 8, 9, 10]},
{...tileOb, icon: "┐", points: "LB", type: 10, types: [7, 8, 9, 10]},

{...tileOb, icon: "┤", points: "LTB", type: 11, types: [11, 12, 13, 14]},
{...tileOb, icon: "┴", points: "LRT", type: 12, types: [11, 12, 13, 14]},
{...tileOb, icon: "├", points: "RTB", type: 13, types: [11, 12, 13, 14]},
{...tileOb, icon: "┬", points: "LRB", type: 14, types: [11, 12, 13, 14]},

{...tileOb, icon: "┼", points: "LRTB", inactive: true, type: 15, types: [15]},

{...tileOb, icon: "◄", points: "L", inactive: true, type: 16, types: [16, 17, 18, 19]},
{...tileOb, icon: "▲", points: "T", inactive: true, type: 17, types: [16, 17, 18, 19]},
{...tileOb, icon: "►", points: "R", inactive: true, type: 18, types: [16, 17, 18, 19]},
{...tileOb, icon: "▼", points: "B", inactive: true, type: 19, types: [16, 17, 18, 19]},

{...tileOb, icon: "╥", points: "B", inactive: true, type: 20, types: [20, 21, 22, 23]},
{...tileOb, icon: "╡", points: "L", inactive: true, type: 21, types: [20, 21, 22, 23]},
{...tileOb, icon: "╨", points: "T", inactive: true, type: 22, types: [20, 21, 22, 23]},
{...tileOb, icon: "╞", points: "R", inactive: true, type: 23, types: [20, 21, 22, 23]},

{...tileOb, icon: "║", points: "TB", inactive: true, type: 24, types: [24, 25]},
{...tileOb, icon: "═", points: "LR", inactive: true, type: 25, types: [24, 25]},

{...tileOb, icon: "╝", points: "LT", inactive: true, type: 26, types: [26, 27, 28, 29]},
{...tileOb, icon: "╚", points: "RT", inactive: true, type: 27, types: [26, 27, 28, 29]},
{...tileOb, icon: "╔", points: "RB", inactive: true, type: 28, types: [26, 27, 28, 29]},
{...tileOb, icon: "╗", points: "LB", inactive: true, type: 29, types: [26, 27, 28, 29]},

{...tileOb, icon: "●", inactive: true, type: 30},
*/

export default [
    {
        pattern: [
            ["╔══╝▼"],
            ["║xxx│"],
            ["╝xxx│"],
            ["→│ │┌"],
        ],
        missed: "─"
    },
    {
        pattern: [
            ["→└┌┴●"],
            ["● ┌│●"],
            ["●╚│┌●"],
            ["●┌┐┌◄"],
        ],
        missed: "─"
    },
    {
        pattern: [
            ["┌│││╡"],
            ["┌─┌│┌"],
            ["┌┌║┌┌"],
            ["→═ ═◄"],
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
            ["  ╥ ◄"],
            [" B┘ ●"],
            ["   ╚ "],
            ["↑● │ "],
        ],
        missed: "┌┌┌┌┌┌│┤"
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
            ["┘┘─└└●╥"],
            ["└┘●└└●║"],
            ["└└ ╔└● "],
            ["└└●└└● "],
            ["└╗●└└● "],
            ["→ ◄└┤ └"],
        ],
        missed: "┴────"
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
            ["└┐─│┐┤┼╥"],
            ["┌ ┬ ┌●┌┌"],
            ["┌┌●┌│┌┌┌"],
            ["┌┌←┌┌●┌│"],
            ["┐┌┌┐ ┌┌ "],
            ["┌└│─▲┌┌╨"],
        ],
        missed: "──┐┤┤"
    },
    {
        pattern: [
            ["┌      ╡"],
            ["┌      ╡"],
            ["→      ◄"],
            ["┌      ╡"],
            ["┌      ╡"],
        ],
        missed: "┤┤┤┤┤┤┐┐┐┐┐┐┐┐┐┐┐┐┐┐┐┐┐┐────"
    },
]