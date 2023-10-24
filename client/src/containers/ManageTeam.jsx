import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router";
import {
  CircularProgress, Listbox, ListboxSection, ListboxItem,
} from "@nextui-org/react";
import { LuCode2, LuSettings, LuUsers2 } from "react-icons/lu";

import { getTeam, saveActiveTeam } from "../slices/team";
import { cleanErrors as cleanErrorsAction } from "../actions/error";
import Navbar from "../components/Navbar";
import canAccess from "../config/canAccess";
import Container from "../components/Container";
import Row from "../components/Row";

/*
  Description
*/
function ManageTeam(props) {
  const {
    cleanErrors, user, team,
  } = props;
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    cleanErrors();
    _getTeam();
  }, []);

  const _getTeam = () => {
    dispatch(getTeam(params.teamId))
      .then((team) => {
        dispatch(saveActiveTeam(team));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const checkActive = () => {
    if (window.location.pathname.indexOf("members") > -1) return "members";
    if (window.location.pathname.indexOf("settings") > -1) return "settings";
    if (window.location.pathname.indexOf("payment") > -1) return "payment";
    if (window.location.pathname.indexOf("api-keys") > -1) return "api-keys";
      
    return false;
  };

  const _onMenuSelect = (key) => {
    if (key === "members") {
      navigate(`/manage/${params.teamId}/members`);
    }
    if (key === "settings") {
      navigate(`/manage/${params.teamId}/settings`);
    }
    if (key === "api-keys") {
      navigate(`/manage/${params.teamId}/api-keys`);
    }
  }

  const _canAccess = (role) => {
    return canAccess(role, user.id, team.TeamRoles);
  };

  if (!team.id || loading) {
    return (
      <Container size="sm" justify="center" style={{ paddingTop: 100 }}>
        <Row justify="center" align="center">
          <CircularProgress size="lg">Loading your team</CircularProgress>
        </Row>
      </Container>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-12 gap-4 container mx-auto">
        <div className="col-span-12 sm:col-span-3 md:col-span-2">
          <div className="pt-4">
            <Listbox
              selectedKeys={[checkActive()]}
              onSelectionChange={(keys) => _onMenuSelect(keys.currentKey) }
              selectionMode="single"
              itemClasses={{ title: "text-md" }}
            >
              <ListboxSection title="Manage the team">
                {_canAccess("teamOwner") && (
                  <ListboxItem key="settings" startContent={<LuSettings />}>
                    Settings
                  </ListboxItem>
                )}
                <ListboxItem key="members" startContent={<LuUsers2 />}>
                  Members
                </ListboxItem>
              </ListboxSection>
              {_canAccess("teamAdmin") && (
                <ListboxSection title="Developers">
                  <ListboxItem key="api-keys" startContent={<LuCode2 />}>
                    API Keys
                  </ListboxItem>
                </ListboxSection>
              )}
            </Listbox>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-9 md:col-span-10">
          <div className="container mx-auto py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

ManageTeam.propTypes = {
  getTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  cleanErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    team: state.team.active,
    user: state.user.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTeam: (id) => dispatch(getTeam(id)),
    cleanErrors: () => dispatch(cleanErrorsAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTeam);