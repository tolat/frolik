import UserIcon from "./UserIcon";
import { Fragment, memo } from "react";

const UserIconCluster = (props) => {
  const containerStyle = {
    width: `${props.sizeInRem}rem`,
    height: `${props.sizeInRem}rem`,
  };
  const mag21 = 1.5;
  const mag22 = 1.3;
  const mag31 = 1.8;
  const mag32 = 1.7;
  const mag33 = 1.6;
  const mag41 = 2;
  const mag42 = 1.8;
  const mag43 = 2.1;
  const mag44 = 1.55;

  return (
    <div style={containerStyle}>
      {props.users.length === 1 ? (
        <UserIcon
          backer={true}
          backerClassName={props.backerClassName}
          sizeInRem={props.sizeInRem}
          user={props.users[0]}
          borderSizeInRem={props.borderSizeInRem}
        />
      ) : props.users.length === 2 ? (
        <Fragment>
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag21}rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag21}
            user={props.users[0]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag21}
          />
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / mag22}rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / mag22}rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag22}
            user={props.users[1]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag22}
          />
        </Fragment>
      ) : props.users.length === 3 ? (
        <Fragment>
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag31}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag31) / 9
              }rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag31}
            user={props.users[0]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag31}
          />
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / mag32}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag32) / 5
              }rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag32}
            user={props.users[1]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag32}
          />
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginLeft: `${
                (props.sizeInRem - props.sizeInRem / mag33) / 3
              }rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / mag33}rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag33}
            user={props.users[2]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag33}
          />
        </Fragment>
      ) : props.users.length === 4 ? (
        <Fragment>
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginRight: `${
                (props.sizeInRem - props.sizeInRem / mag41) / 0.8
              }rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag41) / 11
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag41}
            user={props.users[0]}
            borderSizeInRem={props.borderSizeInRem / mag41}
          />
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / mag43}rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / mag43}rem`,
            }}
            sizeInRem={props.sizeInRem / mag43}
            user={props.users[2]}
            borderSizeInRem={props.borderSizeInRem / mag43}
          />
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginLeft: `${
                (props.sizeInRem - props.sizeInRem / mag42) / 1
              }rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag42) / 8
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag42}
            user={props.users[1]}
            borderSizeInRem={props.borderSizeInRem / mag42}
          />

          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag44}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag44) / 0.95
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag44}
            user={props.users[3]}
            borderSizeInRem={props.borderSizeInRem / mag44}
          />
        </Fragment>
      ) : (
        <Fragment>
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginRight: `${
                (props.sizeInRem - props.sizeInRem / mag41) / 0.8
              }rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag41) / 11
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag41}
            user={props.users[0]}
            borderSizeInRem={props.borderSizeInRem / mag41}
          />
          <div
            style={{
              width: `${props.sizeInRem / 3}rem`,
              height: `${props.sizeInRem / 3}rem`,
              fontSize: `${props.sizeInRem / 5}rem`,
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / 3}rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / 3}rem`,
            }}
          >
            5+
          </div>
          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginLeft: `${
                (props.sizeInRem - props.sizeInRem / mag42) / 1
              }rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag42) / 8
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag42}
            user={props.users[1]}
            borderSizeInRem={props.borderSizeInRem / mag42}
          />

          <UserIcon
            backer={true}
            backerClassName={props.backerClassName}
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag44}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag44) / 0.95
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag44}
            user={props.users[3]}
            borderSizeInRem={props.borderSizeInRem / mag44}
          />
        </Fragment>
      )}
    </div>
  );
};

export default memo(UserIconCluster);
