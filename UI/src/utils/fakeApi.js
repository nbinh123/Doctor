export default function fakeApi(ms = 550) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}