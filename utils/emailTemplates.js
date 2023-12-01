module.exports.genResetPasswordEmail = (link) => {
  return basicEmailTemplate(
    "Reset Account Password",
    `<div>
    You are receiving this because you (or someone else) 
    have requested the reset of the password for your frolik account.
    </div>`,
    link,
    "Reset Password",
    `If you did not request this, please ignore this email and 
    your password will remain unchanged.`
  );
};

module.exports.genVerifyAccountEmail = (link) => {
  return basicEmailTemplate(
    "Verify Account Email",
    `<div>
    You're almost signed up! Click the link below to verify
    your email and log in to your frolik account.
    </div>`,
    link,
    "Verify Email",
    "If you did not sign up on frolik.ca, please ignore this email."
  );
};

module.exports.genOutingInviteAcceptedEmail = (
  by,
  outing,
  unreadAlerts,
  unreadChats
) => {
  const inviteHeaderStyle = `
  color: #FFFFFF;`;

  const activityNameStyle = `
  font-size: 1.6rem; 
  font-weight: bold; 
  margin-top: 1rem; 
  color: #FFFFFF;`;

  const outingNameStyle = `
  font-size: 0.9rem;  
  margin-bottom: 1rem; 
  color: #FFFFFF;`;

  return basicEmailTemplate(
    "Your Outing invite was accepted!",
    `<div style="${inviteHeaderStyle}">${by.first_name} ${by.last_name} 
    has joined your outing:
    </div>
    <div style="${activityNameStyle}">
        ${outing.activity.name}
    </div>
    <div style="${outingNameStyle}">
        Outing Name: ${outing.name}
    </div>`,
    "https://www.frolik.ca/profile",
    "View on frolik.ca",
    "",
    unreadAlerts,
    unreadChats
  );
};

module.exports.genOutingInviteEmail = (
  from,
  outing,
  unreadAlerts = 0,
  unreadChats = 0
) => {
  const inviteHeaderStyle = `
  color: #FFFFFF;`;

  const activityNameStyle = `
  font-size: 1.6rem; 
  font-weight: bold; 
  margin-top: 1rem; 
  color: #FFFFFF;`;

  const outingNameStyle = `
  font-size: 0.9rem;  
  margin-bottom: 1rem; 
  color: #FFFFFF;`;

  return basicEmailTemplate(
    "You have been invited to an Outing!",
    `<div style="${inviteHeaderStyle}">${from.first_name} ${from.last_name} 
    has invited you to their outing:
    </div>
    <div style="${activityNameStyle}">
        ${outing.activity.name}
    </div>
    <div style="${outingNameStyle}">
        Outing Name: ${outing.name}
    </div>`,
    "https://www.frolik.ca/profile",
    "View on frolik.ca",
    "",
    unreadAlerts,
    unreadChats
  );
};

module.exports.dailyUpdateEmail = (unreadAlerts, unreadChats) => {
  return basicEmailTemplate(
    "Daily frolik Update",
    `<div>
        You're receiving this email because you have unread notifications:
        ${alertsSection(unreadAlerts, unreadChats)}
    </div>`,
    "https://www.frolik.ca",
    "View on frolik.ca",
    "",
    0,
    0
  );
};

function basicEmailTemplate(
  headerText,
  content,
  buttonLink,
  buttonText,
  footerText,
  unreadAlerts = 0,
  unreadChats = 0
) {
  const logoIconLink = `http://drive.google.com/uc?export=view&id=1BDG9NX1AMO2pdmqSgFr5FhLft33qRBcH`;

  const bodyStyle = `
  background-color: #2F2F2F'; 
  padding: 1rem; 
  max-width: 40rem; 
  height: 100%;`;

  const mainHeaderContainerStyle = `
  display: grid;
  grid-template-columns: 1fr 1fr;
  `;

  const mainHeaderStyle = `
  color: #FFFFFF; 
  width: fit-content; 
  display: inline-block;`;

  const logoStyle = `
  width: 3rem; 
  height: 3rem; 
  margin-right: 0.5rem;  
  display: inline-block;`;

  const buttonStyle = `
  outline: none; 
  border: none; 
  padding: 1rem; 
  border-radius: 0.1rem; 
  font-size: 1.2rem; 
  background-color: #5BABF2; 
  color: #F0F0F0; 
  font-weight: bold; 
  text-decoration: none; 
  display: table; 
  width: fit-content; 
  margin: 0 0 2rem 0;`;

  const mainContainerStyle = `
  padding: 2rem 3rem 3rem 3rem; 
  background-color: #4C4C4C; 
  border-radius: 0.2rem; 
  font-size: 1.2rem; 
  color: #FFFFFF; 
  width: fit-content; 
  box-sizing: border-box;`;

  return `
  <!DOCTYPE html>
  <html style='background-color: #2A2A2A'; >
  <body style="${bodyStyle}">
  <div style="${mainContainerStyle}">
    <div style=${mainHeaderContainerStyle}>
        <img style="${logoStyle}" alt="" src="${logoIconLink}" />
        <h2 style="${mainHeaderStyle}">${headerText}</h2>
    </div>
    ${content}
    <br/>
    <a style="${buttonStyle}" href='${buttonLink}'>${buttonText}</a>
    <br/>
    <div>
      ${footerText}
    </div>
    ${alertsSection(unreadAlerts, unreadChats)}
</div>
</body>
</html>`;
}

function alertsSection(unreadAlerts = 0, unreadChats = 0) {
  const bellIconLink = `http://drive.google.com/uc?export=view&id=1MUl83_4SZYlEGcAT7mDFuJi0xpBzwqi-`;
  const chatIconLink = `http://drive.google.com/uc?export=view&id=137Ses-ZRQK-r6StWfA4Bx0rYSvbDIHrY`;

  const alertsContainerStyle = `
  vertical-align: middle; 
  margin-top: 1rem;`;

  const alertContainerStyle = `
  color: #FFFFFF;`;

  const alertIconStyle = `
  width: 1.3rem; 
  height: 1.3rem;
  margin-right: 0.4rem;
  display: inline-block;`;

  const badgeStyle = `
  display: inline-block;
  vertical-align: middle; 
  color: #FFFFFF; 
  font-size: 0.8rem; 
  font-weight: bold; 
  text-align: center;
  margin-bottom: 0.6rem;`;

  return `<div style="${alertsContainerStyle}">
    ${
      unreadAlerts > 0
        ? `
        <div style="${alertContainerStyle}">
            <img style="${alertIconStyle}" alt="bell" src="${bellIconLink}" />
            <div style="${badgeStyle}">${unreadAlerts} unread alert(s)</div>
        </div>`
        : ""
    }
    ${
      unreadChats > 0
        ? `
      <div style="${alertContainerStyle}">
          <img style="${alertIconStyle}" alt="bell" src="${chatIconLink}" />
          <div style="${badgeStyle}">${unreadChats} unread chat messsage(s)</div>
      </div>`
        : ""
    }
  </div>`;
}
