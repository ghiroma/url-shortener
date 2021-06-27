export default () => {
    const num = Math.random();

    if(num < 0.05) return 1; // 5%
    else if(num < 0.15) return 2; // 10%
    else if(num < 0.25) return 3; // 10%
    else if(num < 0.35) return 4; // 10%
    else if(num < 0.50) return 5; // 15%
    else return 6; // 50%
}