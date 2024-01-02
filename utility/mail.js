import nodemailer from "nodemailer";

/**
 * account activation mail
 */

export const accountActivationMail = async (to, data) => {

    try {
        let transport = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port : process.env.MAIL_PORT,
            auth : {
                user : process.env.MAIL_ID,
                pass : process.env.MAIL_PASS
            }
        });

        await transport.sendMail({
            from : `Resgistration <${ process.env.MAIL_ID }>`,
            to : to,
            subject : 'Account Activation Mail',
            text: 'Please activate your account',
            html : `
        <style>body{background-color: #e9e9e9; margin: 0px; font-family: Arial, Helvetica, sans-serif;}.template-wrapper{background-color: #fff; width: 500px; margin: 100px auto 0px; border-radius: 5px;}.template-wrapper a{padding: 10px 0px; display: block;}.template-wrapper img{width: 100%;}.template-wrapper a img{width: 200px; display: block; margin: 0px auto;}.body{padding: 20px;}.body a{display: block; text-decoration: none; background-color: #0088ED; text-align: center; color: #fff;}</style> <div class="template-wrapper"> <div class="header"> <a href="https://sorobindu.com/"> <img src="https://sorobindu.com/wp-content/uploads/2022/03/Sorobindu-logo-1.png" alt=""> </a> </div><div class="body"> <h1>Dear ${ data.name }</h1> <p>You recently register in Registration App. To verify your account, click on the link below:</p><a type="submit" href="${ data.link }">Verify Your Account</a> </div></div>
            `
        })
    } catch (error) {
        console.log(error.message);
    }

}