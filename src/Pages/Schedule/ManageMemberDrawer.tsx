import {forwardRef, useImperativeHandle, useState} from "react";
import type Member from "../../types/Member";
import {useDisclose} from "../../hooks/useDisclose";
import {Button, Divider, Drawer, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {nanoid} from "nanoid";
import {MinusCircleOutlined, PlusOutlined, SaveFilled} from "@ant-design/icons";
import BulkEmployeesAddModal from "./Modals/BulkEmployeesAddModal";
import useSelectedTeamActions from "../../contexts/SelectedTeam/useSelectedTeamActions";

export interface ManageMemberDrawerRef {
  openNew: () => void;
  openEdit: (member: Member) => void;
}

interface EmployeeData {
  displayName: string;
  email: string;
  phoneNumber?: string;
  positions: string[];
}

const ManageMemberDrawer = forwardRef<ManageMemberDrawerRef, unknown>(
  (_, ref) => {
    const [member, setMember] = useState<Member>();
    const [isOpen, openDialog, closeDialog] = useDisclose();
    const [form] = Form.useForm<EmployeeData>();
    const {addMember, updateMember} = useSelectedTeamActions();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [bulkAddOpen, setBulkAddOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openNew: () => {
        setMember(undefined);
        form.resetFields();
        openDialog();
      },
      openEdit: (member: Member) => {
        setMember(member);
        form.setFieldsValue(getInitialValues(member));
        openDialog();
      },
    }));

    const handleClose = () => {
      closeDialog();
      form.resetFields();
      setMember(undefined);
    };

    const onFinish = async ({positions, ...values}: EmployeeData) => {
      let employeeToAdd: Member;

      const displayName = values.displayName.trim();
      const email = values.email.trim();

      setLoading(true);

      try {
        if (member != null) {
          employeeToAdd = {
            ...member,
            ...values,
            positions: positions ?? [],
            displayName,
            email,
          };

          await updateMember(member, employeeToAdd);
          void message.success(t("member.updated.success"));
          handleClose();
        } else {
          employeeToAdd = {
            ...values,
            id: nanoid(),
            positions: positions ?? [],
            displayName,
            email,
          };

          await addMember(employeeToAdd);
          void message.success(t("member.added.success"));
          form.resetFields();
        }
      } catch (error) {
        console.log(error);
        void message.error(t("generic.error"));
      } finally {
        setLoading(false);
      }
    };

    return (
      <Drawer
        title={t(member != null ? "edit.member" : "add.member")}
        placement="right"
        open={isOpen}
        onClose={closeDialog}>
        <Form<EmployeeData>
          form={form}
          css={{minWidth: 280, maxWidth: 500, margin: "auto"}}
          layout="vertical"
          onFinish={onFinish}
          initialValues={getInitialValues(member)}
          disabled={loading}
          autoComplete="off"
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}>
          <Form.Item
            required
            label={t("field.fullName")}
            name="displayName"
            rules={[
              {required: true, message: t("field.required")},
              {
                max: 80,
                message: t("field.characters.limit {{0}}", {0: 80}),
              },
              {
                whitespace: true,
                message: t("field.not.empty"),
              },
            ]}>
            <Input maxLength={80} />
          </Form.Item>
          <Form.Item
            label={t("email")}
            name="email"
            normalize={value => value?.toLowerCase()}
            rules={[
              {required: true, message: t("field.required")},
              {type: "email", message: t("field.email.valid")},
              {
                whitespace: true,
                message: t("field.not.empty"),
              },
            ]}>
            <Input type="email" maxLength={255} />
          </Form.Item>

          <Form.List
            name="positions"
            rules={[
              {
                validator: async (_, positions: string[]) => {
                  const compactPositionsSize = new Set(positions).size;
                  // Check if there are repeated positions
                  if (compactPositionsSize !== positions.length) {
                    return await Promise.reject(
                      new Error(t("position.unique")),
                    );
                  }
                  // Check if there are more than 5 positions
                  if (compactPositionsSize > 5) {
                    return await Promise.reject(
                      new Error(t("positions.max {{0}}", {0: 5})),
                    );
                  }
                },
              },
            ]}>
            {(fields, {add, remove}, {errors}) => (
              <Form.Item label="Positions">
                {fields.map(field => (
                  <div
                    key={field.key}
                    css={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      marginBottom: 8,
                      width: "100%",
                    }}>
                    <Form.Item
                      {...field}
                      css={{width: "100%"}}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: t("field.required"),
                        },
                      ]}>
                      <Input maxLength={255} placeholder={t("position")} />
                    </Form.Item>
                    <Button
                      css={{width: 30}}
                      type="text"
                      shape="circle"
                      onClick={() => {
                        remove(field.name);
                      }}
                      icon={<MinusCircleOutlined />}
                      disabled={loading}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}>
                    {t("add.position")}
                  </Button>
                </Form.Item>
                <Form.ErrorList errors={errors} css={{marginBottom: 10}} />
              </Form.Item>
            )}
          </Form.List>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveFilled />}
              block
              loading={loading}>
              {t("btn.save")}
            </Button>
          </Form.Item>
        </Form>

        {member == null && (
          <>
            <Divider css={{margin: "16px 0"}} />
            <Button
              type="dashed"
              onClick={() => {
                setBulkAddOpen(true);
              }}
              block>
              {t("add.bulk")}
            </Button>
            <BulkEmployeesAddModal
              open={bulkAddOpen}
              onCancel={() => {
                setBulkAddOpen(false);
              }}
            />
          </>
        )}
      </Drawer>
    );
  },
);

ManageMemberDrawer.displayName = "ManageMemberDialog";

export default ManageMemberDrawer;

const getInitialValues = (member?: Member): EmployeeData => {
  if (member == null)
    return {
      displayName: "",
      email: "",
      phoneNumber: "",
      positions: [],
    };
  return {
    displayName: member.displayName,
    email: member.email,
    phoneNumber: member.phoneNumber,
    positions: member.positions ?? [],
  };
};
