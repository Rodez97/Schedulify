import {forwardRef, useImperativeHandle, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, ColorPicker, Drawer, Form, Input} from "antd/es";
import {SaveFilled} from "@ant-design/icons";
import type Team from "../../types/Team";
import {
  doc,
  serverTimestamp,
  setDoc,
  type WithFieldValue,
} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {nanoid} from "nanoid";
import {type Color} from "antd/es/color-picker";
import {DEFAULT_SCHEDULE_LIMITS} from "../../utils/constants";

interface TeamData {
  name: string;
  color: Color | string;
}

export interface ManageTeamRef {
  newTeam: () => void;
  editTeam: (team: Team) => void;
}

export const ManageScheduleModal = forwardRef<ManageTeamRef, unknown>(
  (_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [schedule, setSchedule] = useState<Team>();
    const [form] = Form.useForm<TeamData>();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const {user} = useMainUser();

    const onCancel = () => {
      setIsOpen(false);
      setSchedule(undefined);
      form.resetFields();
    };

    useImperativeHandle(
      ref,
      () => ({
        newTeam: () => {
          setIsOpen(true);
        },
        editTeam: (schedule: Team) => {
          setSchedule(schedule);
          form.setFieldsValue({
            name: schedule.name,
            color: schedule.color,
          });
          setIsOpen(true);
        },
      }),
      [form],
    );

    const onFinish = async ({name, color}: TeamData) => {
      let scheduleToSave: WithFieldValue<Team>;
      let scheduleId: string;
      const hexColor = typeof color === "string" ? color : color.toHexString();

      if (schedule != null) {
        scheduleToSave = {
          ...schedule,
          name,
          color: hexColor,
        };
        scheduleId = schedule.id;
      } else {
        scheduleId = nanoid();
        scheduleToSave = {
          id: scheduleId,
          name,
          color: hexColor,
          createdAt: serverTimestamp(),
          ownerId: user.uid,
          limits: DEFAULT_SCHEDULE_LIMITS,
        };
      }

      try {
        setLoading(true);
        await setDoc(doc(FIRESTORE, "schedules", scheduleId), scheduleToSave);

        form.resetFields();
        onCancel();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Drawer
        title={schedule != null ? t("schedule.edit") : t("schedule.new")}
        placement="right"
        closable={false}
        onClose={onCancel}
        open={isOpen}>
        <Form<TeamData>
          form={form}
          css={{minWidth: 280, maxWidth: 500, margin: "auto"}}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: schedule?.name ?? "",
            // Generate a random hex color for this schedule
            color:
              schedule?.color ??
              `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }}
          disabled={loading}
          autoComplete="off"
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}>
          <Form.Item
            required
            label={t("name")}
            name="name"
            rules={[
              {required: true, message: ""},
              {
                max: 20,
                message: t("field.characters.limit {{0}}", {0: 20}),
              },
              {
                whitespace: true,
                message: t("field.not.empty"),
              },
            ]}>
            <Input maxLength={20} showCount />
          </Form.Item>

          <Form.Item
            required
            label={t("color")}
            name="color"
            rules={[{required: true, message: ""}]}>
            <ColorPicker
              presets={[
                {
                  label: "Recommended",
                  colors: [
                    "#000000",
                    "#000000E0",
                    "#000000A6",
                    "#00000073",
                    "#00000040",
                    "#00000026",
                    "#0000001A",
                    "#00000012",
                    "#0000000A",
                    "#00000005",
                    "#F5222D",
                    "#FA8C16",
                    "#FADB14",
                    "#8BBB11",
                    "#52C41A",
                    "#13A8A8",
                    "#1677FF",
                    "#2F54EB",
                    "#722ED1",
                    "#EB2F96",
                    "#F5222D4D",
                    "#FA8C164D",
                    "#FADB144D",
                    "#8BBB114D",
                    "#52C41A4D",
                    "#13A8A84D",
                    "#1677FF4D",
                    "#2F54EB4D",
                    "#722ED14D",
                    "#EB2F964D",
                  ],
                },
                {
                  label: "Recent",
                  colors: [],
                },
              ]}
              format="hex"
            />
          </Form.Item>

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
      </Drawer>
    );
  },
);

ManageScheduleModal.displayName = "ManageScheduleModal";

export default ManageScheduleModal;
