const { Button } =
  VM.require("buildhub.near/widget/components") || (() => <></>);

const [accountId, setAccountId] = useState("");
const [role, setRole] = useState("");
const roles = props.roles;
const selectedDAO = props.selectedDAO;

return (
  <div className="d-flex flex-column">
    <div className="form-group mb-3">
      <label htmlFor="accountId">Account ID</label>
      <input
        name="accountId"
        id="accountId"
        className="form-control"
        data-bs-theme="dark"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />
    </div>

    <div className="form-group mb-3">
      <label htmlFor="role">Role</label>
      <select
        name="role"
        id="role"
        data-bs-theme="dark"
        class="form-select"
        onChange={(e) => setRole(e.target.value)}
        selected={role}
      >
        <option>Select a role</option>
        {roles.length > 0 &&
          roles.map((role) => <option value={role}>{role}</option>)}
      </select>
    </div>

    <div className="w-100 d-flex">
      <Button
        className="ms-auto"
        variant="primary"
        disabled={!accountId || !role}
        onClick={() =>
          Near.call(selectedDAO, "add_proposal", {
            proposal: {
              description: "Potential member",
              kind: {
                AddMemberToRole: {
                  member_id: accountId,
                  role: role,
                },
              },
            },
          })
        }
      >
        Next
      </Button>
    </div>
  </div>
);
