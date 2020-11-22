"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiPicker = void 0;
const react_1 = __importStar(require("react"));
const utils_1 = require("./utils");
require("./EmojiPicker.css");
const Navbar_1 = __importDefault(require("./EmojiPicker/Navbar"));
const Footer_1 = __importDefault(require("./EmojiPicker/Footer"));
const Scroll_1 = __importDefault(require("./EmojiPicker/Scroll"));
function EmojiPickerRefComponent({ emojiData = {}, emojiSize = 36, numberScrollRows = 12, onEmojiSelect = (emoji) => console.log(emoji), showNavbar = false, showFooter = false, showScroll = true, emojisPerRow = 9, onKeyDownScroll = (event) => null, collapseCategoriesOnSearch = true, collapseHeightOnSearch = true, theme = "system" }, ref) {
    const [searchEmojis, setSearchEmojis] = react_1.useState({ emojis: null, query: "" });
    const [focusedEmoji, setFocusedEmoji] = react_1.useState({ row: 1, emoji: Object.values(emojiData).flat()[0], focusOnRender: false });
    const { itemCount, itemRanges } = react_1.useMemo(() => utils_1.calcCountAndRange(searchEmojis.emojis || emojiData, emojisPerRow), [searchEmojis, emojisPerRow]);
    react_1.useEffect(function () {
        var _a;
        const [emoji] = Object.values(searchEmojis.emojis || emojiData).flat();
        setFocusedEmoji(emoji ? { row: 1, emoji, focusOnRender: Boolean((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.closest(".emoji-picker-scroll")) } : null);
    }, [searchEmojis]);
    const search = (query) => {
        if (!query) {
            setSearchEmojis({ emojis: null, query: "" });
            return;
        }
        if (searchEmojis.emojis != null && !Object.values(searchEmojis.emojis).flat().length && searchEmojis.query.length < query.length)
            return;
        const index = Object.values(searchEmojis.query.length < query.length && searchEmojis.emojis != null ? searchEmojis.emojis : emojiData).flat();
        let results = index
            .map(emoji => ({ emoji, score: (emoji.keywords || []).map(word => word.indexOf(query) != -1).reduce((a, b) => a + Number(b), Number(emoji.name.indexOf(query) != -1) * 3) }))
            .filter(a => a.score != 0)
            .sort((a, b) => b.score - a.score)
            .map(({ emoji }) => emoji);
        if (collapseCategoriesOnSearch) {
            setSearchEmojis({ emojis: { "Search Results": results }, query });
        }
        else {
            const grouped = Object.entries(emojiData).map(([category, list]) => ([category, list.filter(emoji => results.includes(emoji))])).reduce((sum, [category, list]) => Object.assign(sum, { [category]: list }), {});
            setSearchEmojis({ emojis: grouped, query });
        }
    };
    const handleClickInScroll = (emoji, row) => (event) => {
        onEmojiSelect(emoji);
        emoji != (focusedEmoji === null || focusedEmoji === void 0 ? void 0 : focusedEmoji.emoji) && setFocusedEmoji({ row, emoji, focusOnRender: true });
    };
    const handleMouseInScroll = (emoji, row) => (event) => {
        if (event.movementX == 0 && event.movementY == 0 || emoji == (focusedEmoji === null || focusedEmoji === void 0 ? void 0 : focusedEmoji.emoji))
            return;
        setFocusedEmoji({ row, emoji, focusOnRender: true });
    };
    const handleKeyDownScroll = (event) => {
        var _a, _b, _c, _d, _e;
        const emojis = Object.values(searchEmojis.emojis || emojiData).filter(array => array.length !== 0);
        switch (event.key) {
            case "Enter": {
                event.preventDefault();
                if (!focusedEmoji) {
                    let emoji = Object.values(searchEmojis.emojis || emojiData).flat()[0];
                    emoji && setFocusedEmoji({ row: 1, emoji, focusOnRender: Boolean((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.closest(".emoji-picker-scroll")) });
                }
                else {
                    focusedEmoji && onEmojiSelect(focusedEmoji.emoji);
                }
                return;
            }
            case "ArrowUp": {
                event.preventDefault();
                let emoji, row;
                if (!focusedEmoji) {
                    emoji = Object.values(searchEmojis.emojis || emojiData).flat()[0];
                    row = 1;
                }
                else {
                    let arrayIndex, arrayEmoji, emojiIndex;
                    emojis.find((array, index) => {
                        emojiIndex = array.findIndex(emoji => emoji === focusedEmoji.emoji), arrayIndex = index, arrayEmoji = array;
                        return emojiIndex !== -1;
                    });
                    if (emojiIndex != undefined) {
                        if (emojiIndex - emojisPerRow >= 0) {
                            emoji = arrayEmoji[emojiIndex - emojisPerRow];
                            row = focusedEmoji.row - 1;
                        }
                        else if (arrayIndex !== 0) {
                            const arrayAbove = emojis[arrayIndex - 1];
                            const index = (emojiIndex > (arrayAbove.length - 1) % emojisPerRow) ? arrayAbove.length - 1 : Math.floor((arrayAbove.length - 1 - emojiIndex) / emojisPerRow) * emojisPerRow + emojiIndex;
                            emoji = arrayAbove[index];
                            row = focusedEmoji.row - 2;
                        }
                    }
                }
                emoji && setFocusedEmoji({ row, emoji, focusOnRender: Boolean((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.closest(".emoji-picker-scroll")) });
                return;
            }
            case "ArrowDown": {
                event.preventDefault();
                let emoji, row;
                if (!focusedEmoji) {
                    emoji = Object.values(searchEmojis.emojis || emojiData).flat()[0];
                    row = 1;
                }
                else {
                    let arrayIndex, arrayEmoji, emojiIndex;
                    emojis.find((array, index) => {
                        emojiIndex = array.findIndex(emoji => emoji === focusedEmoji.emoji), arrayIndex = index, arrayEmoji = array;
                        return emojiIndex !== -1;
                    });
                    if (emojiIndex != undefined) {
                        if (emojiIndex + emojisPerRow < arrayEmoji.length) {
                            emoji = arrayEmoji[emojiIndex + emojisPerRow];
                            row = focusedEmoji.row + 1;
                        }
                        else if (emojiIndex + emojisPerRow < Math.ceil(arrayEmoji.length / emojisPerRow) * emojisPerRow) {
                            emoji = arrayEmoji[arrayEmoji.length - 1];
                            row = focusedEmoji.row + 1;
                        }
                        else if (arrayIndex !== emojis.length - 1) {
                            const arrayBelow = emojis[arrayIndex + 1], modIndex = emojiIndex % emojisPerRow;
                            emoji = arrayBelow[modIndex] || arrayBelow[arrayBelow.length - 1];
                            row = focusedEmoji.row + 2;
                        }
                    }
                }
                emoji && setFocusedEmoji({ row, emoji, focusOnRender: Boolean((_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.closest(".emoji-picker-scroll")) });
                return;
            }
            case "ArrowLeft": {
                event.preventDefault();
                let emoji, row;
                if (!focusedEmoji) {
                    emoji = Object.values(searchEmojis.emojis || emojiData).flat()[0];
                    row = 1;
                }
                else {
                    let arrayIndex, arrayEmoji, emojiIndex;
                    emojis.find((array, index) => {
                        emojiIndex = array.findIndex(emoji => emoji === focusedEmoji.emoji), arrayIndex = index, arrayEmoji = array;
                        return emojiIndex !== -1;
                    });
                    if (emojiIndex != undefined) {
                        if (emojiIndex - 1 >= 0) {
                            emoji = arrayEmoji[emojiIndex - 1];
                            row = Math.floor(emojiIndex / emojisPerRow) == Math.floor((emojiIndex - 1) / emojisPerRow) ? focusedEmoji.row : focusedEmoji.row - 1;
                        }
                        else if (arrayIndex !== 0) {
                            const arrayAbove = emojis[arrayIndex - 1];
                            emoji = arrayAbove[arrayAbove.length - 1];
                            row = focusedEmoji.row - 2;
                        }
                    }
                }
                emoji && setFocusedEmoji({ row, emoji, focusOnRender: Boolean((_d = document.activeElement) === null || _d === void 0 ? void 0 : _d.closest(".emoji-picker-scroll")) });
                return;
            }
            case "ArrowRight": {
                event.preventDefault();
                let emoji, row;
                if (!focusedEmoji) {
                    emoji = Object.values(searchEmojis.emojis || emojiData).flat()[0];
                    row = 1;
                }
                else {
                    let arrayIndex, arrayEmoji, emojiIndex;
                    emojis.find((array, index) => {
                        emojiIndex = array.findIndex(emoji => emoji === focusedEmoji.emoji), arrayIndex = index, arrayEmoji = array;
                        return emojiIndex !== -1;
                    });
                    if (emojiIndex != undefined) {
                        let newIndex = emojiIndex + 1;
                        if (newIndex < arrayEmoji.length) {
                            emoji = arrayEmoji[newIndex];
                            row = Math.floor(emojiIndex / emojisPerRow) == Math.floor(newIndex / emojisPerRow) ? focusedEmoji.row : focusedEmoji.row + 1;
                        }
                        else if (arrayIndex !== emojis.length - 1) {
                            let arrayBelow = emojis[arrayIndex + 1];
                            emoji = arrayBelow[0];
                            row = focusedEmoji.row + 2;
                        }
                    }
                }
                emoji && setFocusedEmoji({ row, emoji, focusOnRender: Boolean((_e = document.activeElement) === null || _e === void 0 ? void 0 : _e.closest(".emoji-picker-scroll")) });
                return;
            }
            default:
                onKeyDownScroll(event);
        }
    };
    react_1.useImperativeHandle(ref, () => ({ search, handleKeyDownScroll, emojis: searchEmojis.emojis || emojiData, focusedEmoji: focusedEmoji === null || focusedEmoji === void 0 ? void 0 : focusedEmoji.emoji }));
    const refVirtualList = react_1.useRef(null);
    const ScrollProps = {
        emojisPerRow: emojisPerRow,
        emojiSize,
        numberScrollRows,
        focusedEmoji,
        refVirtualList,
        handleClickInScroll,
        handleMouseInScroll,
        collapseHeightOnSearch,
        itemCount,
        itemRanges,
    };
    const handleClickInNavbar = (category) => (event) => {
        let virtualList = refVirtualList.current;
        if (virtualList) {
            let range = itemRanges.find(range => range.key === category);
            range && virtualList.scrollToItem(range.from, "start");
        }
    };
    const [width, setWidth] = react_1.useState(`calc(${emojiSize}px * ${emojisPerRow} + 1em + ${utils_1.measureScrollbar()}px)`);
    react_1.useEffect(() => {
        const resizeWidth = () => setWidth(`calc(${emojiSize}px * ${emojisPerRow} + 1em + ${utils_1.measureScrollbar()}px)`);
        window.addEventListener("resize", resizeWidth);
        return () => window.removeEventListener("resize", resizeWidth);
    }, []);
    return (react_1.default.createElement("div", { className: `emoji-picker emoji-picker-${theme}`, style: { width } },
        showNavbar && react_1.default.createElement(Navbar_1.default, { data: emojiData, handleClickInNavbar: handleClickInNavbar }),
        react_1.default.createElement("div", { className: "emoji-picker-scroll", role: "grid", "aria-rowcount": itemCount, "aria-colcount": emojisPerRow, onKeyDown: handleKeyDownScroll }, searchEmojis.emojis
            ? Object.values(searchEmojis.emojis).flat().length !== 0
                ? react_1.default.createElement(Scroll_1.default, Object.assign({}, ScrollProps, { emojiData: searchEmojis.emojis }))
                : react_1.default.createElement("div", { className: "emoji-picker-category", style: { height: collapseHeightOnSearch ? 'inherit' : '432px' } },
                    react_1.default.createElement("div", { className: "emoji-picker-category-title" }, "No results"))
            : showScroll &&
                react_1.default.createElement(Scroll_1.default, Object.assign({}, ScrollProps, { emojiData: emojiData }))),
        showFooter && react_1.default.createElement(Footer_1.default, { emoji: focusedEmoji === null || focusedEmoji === void 0 ? void 0 : focusedEmoji.emoji })));
}
exports.EmojiPicker = react_1.forwardRef(EmojiPickerRefComponent);
//# sourceMappingURL=EmojiPicker.js.map