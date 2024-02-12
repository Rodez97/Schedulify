import {Alert, Checkbox, Form, Input, Modal, Typography} from "antd/es";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelectedTeam} from "../../../contexts/SelectedTeam/useSelectedTeam";
import useSelectedTeamActions from "../../../contexts/SelectedTeam/useSelectedTeamActions";
import parseEmployeesFromCSV, {
  type CSVRow,
} from "../../../utils/parseEmployeesFromCSV";

function BulkEmployeesAddModal(props: {open: boolean; onCancel: () => void}) {
  const {t} = useTranslation();
  const {usage} = useSelectedTeam();
  const {addBulkMember} = useSelectedTeamActions();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<
    Array<{emp: CSVRow; selected: boolean}>
  >([]);
  const [error, setError] = useState<Error | undefined>();

  const handleSelectedEmpChange = (emp: CSVRow) => {
    setSelectedEmployees(prev => {
      const index = prev.findIndex(e => e.emp.NAME === emp.NAME);
      if (index === -1) {
        return [...prev, {emp, selected: true}];
      }
      return prev.map((e, i) => {
        if (i === index) {
          return {emp, selected: !e.selected};
        }
        return e;
      });
    });
  };

  const addBulk = async () => {
    try {
      setIsAdding(true);
      const selected = selectedEmployees.filter(e => e.selected);
      const finalSelected = selected.map(e => e.emp);
      await addBulkMember(finalSelected);
      props.onCancel();
    } catch (error) {
      console.log(error);

      setError(new Error(t("bulk.employees.error")));
    } finally {
      setIsAdding(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file == null) return;

    // validate file size
    if (file.size > 1024 * 5) {
      setError(new Error(t("bulk.employees.error")));
      return;
    }

    // validate file type
    const allowedTypes = ["text/csv"];
    if (!allowedTypes.includes(file.type)) {
      setError(new Error(t("bulk.employees.error")));
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      try {
        const pairs = parseEmployeesFromCSV(content);
        setSelectedEmployees(pairs.map(emp => ({emp, selected: true})));
      } catch (error) {
        setError(new Error(t("bulk.employees.error")));
      }
    };
    reader.onerror = () => {
      setError(new Error(t("bulk.employees.error")));
    };
    reader.readAsText(file);
  };

  const canAdd = useMemo(() => {
    const maxEmployees = usage.maxMembers;
    const currentEmployees = usage.members;
    const selected = selectedEmployees.filter(e => e.selected);
    const selectedCount = selected.length;
    return selectedCount + currentEmployees <= maxEmployees;
  }, [selectedEmployees, usage.maxMembers, usage.members]);

  return (
    <Modal
      title={t("add.bulk")}
      {...props}
      onOk={addBulk}
      cancelText={t("btn.cancel")}
      confirmLoading={isAdding}
      okButtonProps={{disabled: Boolean(!canAdd || error)}}>
      <Typography.Paragraph
        type="secondary"
        css={{
          textAlign: "center",
        }}>
        {t("bulk.employees.subtitle")}
      </Typography.Paragraph>
      <div css={{display: "flex", justifyContent: "center", margin: 10}}>
        <Form.Item
          css={{
            width: "100%",
          }}
          help={t("bulk.employees.help")}>
          <Input
            type="file"
            // Only accept .csv files
            accept=".csv"
            onChange={handleFileChange}
          />
        </Form.Item>
      </div>

      {!canAdd && (
        <Alert
          showIcon
          type="warning"
          message={t("bulk.employees.max.employees")}
        />
      )}

      {error != null && (
        <Alert
          css={{marginTop: 10}}
          showIcon
          type="warning"
          message={t(error.message)}
        />
      )}
      <div
        css={{
          maxHeight: "50vh",
          overflowY: "auto",
          marginTop: 10,
          width: "100%",
        }}>
        {selectedEmployees.map(({emp, selected}) => (
          <div
            key={emp.NAME}
            css={{
              display: "flex",
              alignItems: "center",
              padding: 10,
              borderBottom: "1px solid #e8e8e8",
              justifyContent: "space-between",
            }}>
            <div
              css={{
                display: "flex",
                flexDirection: "column",
              }}>
              <Typography.Text
                ellipsis
                css={{
                  marginLeft: 10,
                  marginRight: 10,
                  flex: 1,
                }}>
                {emp.NAME}
              </Typography.Text>
              <Typography.Text
                ellipsis
                css={{
                  marginLeft: 10,
                  marginRight: 10,
                  flex: 1,
                  fontSize: 12,
                }}
                type="secondary">
                {emp.EMAIL}
              </Typography.Text>
            </div>

            <Checkbox
              checked={selected}
              onChange={() => {
                handleSelectedEmpChange(emp);
              }}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default BulkEmployeesAddModal;
