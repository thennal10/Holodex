export function resizeChannelPhoto(photoUrl, size) {
    const split = photoUrl.split("=s");
    // try to hit cache by using a common size
    let adjSize = 40;
    if (size < 88 && size > 40) adjSize = 88;
    else if (size < 40) adjSize = 40;
    else adjSize = size;
    return `${split[0]}=s${adjSize}-c-k-c0x00ffffff-no-rj-mo`;
}

export function getVideoThumbnails(ytVideoKey, useWebP) {
    const base = useWebP ? "https://i.ytimg.com/vi_webp" : "https://i.ytimg.com/vi";
    const ext = useWebP ? "webp" : "jpg";
    return {
        // 120w
        default: `${base}/${ytVideoKey}/default.${ext}`,
        // 320w
        medium: `${base}/${ytVideoKey}/mqdefault.${ext}`,
        // 640w
        standard: `${base}/${ytVideoKey}/sddefault.${ext}`,
        // 1280w
        maxres: `${base}/${ytVideoKey}/maxresdefault.${ext}`,
        hq720: `${base}/${ytVideoKey}/hq720.${ext}`,
    };
}

export function getBannerImages(url) {
    const base = `${url.split("=")[0]}=`;
    return {
        banner: `${base}w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`,
        mobile: `${base}w640-fcrop64=1,32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj`,
        // bannerTabletLowImageUrl:
        //     "w1138-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
        tablet: `${base}w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`,
        // bannerTabletHdImageUrl:
        //     "w2276-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
        // bannerTabletExtraHdImageUrl:
        //     "w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
        // bannerMobileLowImageUrl:
        //     "w320-fcrop64=1,32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj",
        // bannerMobileMediumHdImageUrl:
        //     "w960-fcrop64=1,32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj",
        // bannerMobileHdImageUrl:
        //     "w1280-fcrop64=1,32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj",
        // bannerMobileExtraHdImageUrl:
        //     "w1440-fcrop64=1,32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj",
        tv: `${base}w2120-fcrop64=1,00000000ffffffff-k-c0xffffffff-no-nd-rj`,
        // bannerTvLowImageUrl:
        //     "w854-fcrop64=1,00000000ffffffff-k-c0xffffffff-no-nd-rj",
        // bannerTvMediumImageUrl:
        //     "w1280-fcrop64=1,00000000ffffffff-k-c0xffffffff-no-nd-rj",
        // bannerTvHighImageUrl:
        //     "w1920-fcrop64=1,00000000ffffffff-k-c0xffffffff-no-nd-rj",
    };
}

const formatters = {};

export function formatCount(n, lang = "en") {
    if (!formatters[lang])
        formatters[lang] = new Intl.NumberFormat(lang, { compactDisplay: "short", notation: "compact" });
    let num = n;
    if (typeof n === "string") num = +n;
    return formatters[lang].format(num);
}

export function debounce(func, wait, immediate) {
    let timeout;
    // eslint-disable-next-line func-names
    return function (...args) {
        const context = this;
        // eslint-disable-next-line func-names
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function decodeHTMLEntities(str) {
    return str.split("&amp;").join("&").split("&quot;").join('"');
}

export function forwardTransformSearchToAPIQuery(obj, initialObject) {
    return obj.reduceRight((req, item) => {
        switch (item.type) {
            case "title & desc":
                req.conditions.push({
                    text: item.text,
                });
                break;
            case "comments":
                req.comment = [item.text];
                break;
            case "channel":
                req.vch.push(item.value);
                break;
            case "topic":
                req.topic.push(item.value);
                break;
            case "org":
                req.org.push(item.value);
                break;
            default:
                break;
        }
        return req;
    }, initialObject);
}

export function localSortChannels(channels, { sort, order = "asc" }) {
    if (!sort) return channels;
    channels.sort((a, b) => {
        // if (sort === "latest_published_at") {
        //     const dateA = new Date(a[sort]).getTime();
        //     const dateB = new Date(b[sort]).getTime();
        //     return dateA > dateB ? 1 : -1;
        // }
        if (sort === "video_count" || sort === "subscriber_count") {
            return Number(a[sort]) > Number(b[sort]) ? 1 : -1;
        }
        return a[sort] > b[sort] ? 1 : -1;
    });
    if (order === "desc") channels.reverse();
    return channels;
}

export function arrayChunk(arr, size) {
    return Array.from(new Array(Math.ceil(arr.length / size)), (_, i) => arr.slice(i * size, i * size + size));
}
