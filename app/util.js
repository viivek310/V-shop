function formatToINR(num) {
    var x = num?.toString();
    var lastThree = x?.substring(x.length - 3);
    var otherNumbers = x?.substring(0, x.length - 3);
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    var result = otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return result;
}

export default formatToINR;