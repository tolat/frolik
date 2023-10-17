import { useSelector } from "react-redux";
import UserIcon from "./UserIcon";
import { Fragment } from "react";

const UserIconCluster = (props) => {
  const outing = useSelector((state) => state.go.outing);
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
  const mag42 = 1.7;
  const mag43 = 2.1;
  const mag44 = 1.6;

  return (
    <div style={containerStyle}>
      {outing.users.length === 1 ? (
        <UserIcon
          sizeInRem={props.sizeInRem}
          user={outing.users[0]}
          borderSizeInRem={props.borderSizeInRem}
        />
      ) : outing.users.length === 2 ? (
        <Fragment>
          <UserIcon
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag21}rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag21}
            user={outing.users[0]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag21}
          />
          <UserIcon
            style={{
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / mag22}rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / mag22}rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag22}
            user={outing.users[1]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag22}
          />
        </Fragment>
      ) : outing.users.length === 3 ? (
        <Fragment>
          <UserIcon
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag31}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag31) / 9
              }rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag31}
            user={outing.users[0]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag31}
          />
          <UserIcon
            style={{
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / mag32}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag32) / 5
              }rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag32}
            user={outing.users[1]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag32}
          />
          <UserIcon
            style={{
              position: "absolute",
              marginLeft: `${
                (props.sizeInRem - props.sizeInRem / mag33) / 3
              }rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / mag33}rem`,
            }}
            sizeInRem={parseFloat(props.sizeInRem) / mag33}
            user={outing.users[2]}
            borderSizeInRem={parseFloat(props.borderSizeInRem) / mag33}
          />
        </Fragment>
      ) : outing.users.length === 4 ? (
        <Fragment>
          <UserIcon
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
            user={outing.users[0]}
            borderSizeInRem={props.borderSizeInRem / mag41}
          />
          <UserIcon
            style={{
              position: "absolute",
              marginLeft: `${props.sizeInRem - props.sizeInRem / mag43}rem`,
              marginTop: `${props.sizeInRem - props.sizeInRem / mag43}rem`,
            }}
            sizeInRem={props.sizeInRem / mag43}
            user={outing.users[2]}
            borderSizeInRem={props.borderSizeInRem / mag43}
          />
          <UserIcon
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
            user={outing.users[1]}
            borderSizeInRem={props.borderSizeInRem / mag42}
          />

          <UserIcon
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag44}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag44) / 0.95
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag44}
            user={outing.users[3]}
            borderSizeInRem={props.borderSizeInRem / mag44}
          />
        </Fragment>
      ) : (
        <Fragment>
          <UserIcon
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
            user={outing.users[0]}
            borderSizeInRem={props.borderSizeInRem / mag41}
          />
          <div
            style={{
                width: `${props.sizeInRem / 3}rem`,
                height: `${props.sizeInRem / 3}rem`,
              fontSize: `${props.sizeInRem / 5}rem`,
              position: "absolute",
              marginLeft: `${props.sizeInRem - (props.sizeInRem/3)}rem`,
              marginTop: `${props.sizeInRem - (props.sizeInRem/3)}rem`,
            }}
          >
            5+
          </div>
          <UserIcon
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
            user={outing.users[1]}
            borderSizeInRem={props.borderSizeInRem / mag42}
          />

          <UserIcon
            style={{
              position: "absolute",
              marginRight: `${props.sizeInRem - props.sizeInRem / mag44}rem`,
              marginTop: `${
                (props.sizeInRem - props.sizeInRem / mag44) / 0.95
              }rem`,
            }}
            sizeInRem={props.sizeInRem / mag44}
            user={outing.users[3]}
            borderSizeInRem={props.borderSizeInRem / mag44}
          />
        </Fragment>
      )}
    </div>
  );
};

export default UserIconCluster;
