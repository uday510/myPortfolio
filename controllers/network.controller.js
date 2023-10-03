const checkInternetStatus = async (req, res) => {
    
    try {
        const clientIP = req;
        console.log(clientIP);
        return res.status(200).send('<h4>Your Internet Working Fine.</h4>');
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkInternetStatus: checkInternetStatus
}