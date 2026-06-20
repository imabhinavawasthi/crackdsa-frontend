declare module 'jsvectormap' {
    interface jsVectorMapOptions {
        [key: string]: unknown;
    }

    class jsVectorMap {
        constructor(options: jsVectorMapOptions);
    }

    export default jsVectorMap;
}
