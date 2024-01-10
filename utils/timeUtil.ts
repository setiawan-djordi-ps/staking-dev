const TimeUtils = {
    fromSecondsToDHMS: (seconds: bigint | number) => {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        // var dDisplay = d > 0 ? d + (" d, ") : "0 d, ";
        // var hDisplay = h > 0 ? h + (" h, ") : "0 h, ";
        // var mDisplay = m > 0 ? m + (" m, ") : "0 m, ";
        // var sDisplay = s > 0 ? s + (" s") : "0 s";

        
        // return `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`;
        return `${d.toString().padStart(2, '0')} : ${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`
    }
} 

export default TimeUtils;