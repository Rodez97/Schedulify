import {useSelectedTeam} from "./useSelectedTeam";
import type Team from "../../types/Team";
import {ScheduleConverter} from "../../types/Team";
import {
  type PartialWithFieldValue,
  arrayRemove,
  arrayUnion,
  deleteField,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import type Member from "../../types/Member";
import {
  type ScheduleMembership,
  ScheduleMembershipConverter,
} from "../../types/ScheduleMembership";
import {nanoid} from "nanoid";

function useSelectedTeamActions() {
  const {schedule} = useSelectedTeam();

  const updateSchedule = async (newData: Partial<Team>) => {
    const docRef = doc(FIRESTORE, "schedules", schedule.id);

    try {
      await setDoc(docRef, newData, {merge: true});
    } catch (error) {
      console.log(error);
    }
  };

  const addMember = async (member: Member) => {
    const batch = writeBatch(FIRESTORE);
    const docRef = doc(FIRESTORE, "schedules", schedule.id).withConverter(
      ScheduleConverter,
    );
    const membershipDocRef = doc(
      FIRESTORE,
      "scheduleMembership",
      schedule.id,
    ).withConverter(ScheduleMembershipConverter);

    batch.set(
      membershipDocRef,
      {
        members: {
          [member.id]: member,
        },
        scheduleId: schedule.id,
      },
      {merge: true},
    );

    batch.set(
      docRef,
      {
        members: arrayUnion(member.email),
      },
      {merge: true},
    );

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const addBulkMember = async (
    members: Array<{
      NAME: string;
      EMAIL: string;
    }>,
  ) => {
    const batch = writeBatch(FIRESTORE);
    const docRef = doc(FIRESTORE, "schedules", schedule.id).withConverter(
      ScheduleConverter,
    );
    const membershipDocRef = doc(
      FIRESTORE,
      "scheduleMembership",
      schedule.id,
    ).withConverter(ScheduleMembershipConverter);

    const newMemberships: PartialWithFieldValue<ScheduleMembership> = {
      members: {},
      scheduleId: schedule.id,
    };

    members.forEach(member => {
      const memberId = nanoid();
      newMemberships.members = {
        ...newMemberships.members,
        [memberId]: {
          id: memberId,
          displayName: member.NAME,
          email: member.EMAIL.toLowerCase().trim(),
        },
      };
    });

    batch.set(membershipDocRef, newMemberships, {merge: true});

    batch.set(
      docRef,
      {
        members: arrayUnion(
          ...members.map(member => member.EMAIL.toLowerCase().trim()),
        ),
      },
      {merge: true},
    );

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const removeMember = async (member: Member) => {
    const batch = writeBatch(FIRESTORE);
    const docRef = doc(FIRESTORE, "schedules", schedule.id).withConverter(
      ScheduleConverter,
    );
    const membershipDocRef = doc(
      FIRESTORE,
      "scheduleMembership",
      schedule.id,
    ).withConverter(ScheduleMembershipConverter);

    batch.set(
      membershipDocRef,
      {
        members: {
          [member.id]: deleteField(),
        },
      },
      {merge: true},
    );

    batch.set(
      docRef,
      {
        members: arrayRemove(member.email),
      },
      {merge: true},
    );

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const updateMember = async (
    prevMember: Member,
    member: PartialWithFieldValue<Member>,
  ) => {
    const batch = writeBatch(FIRESTORE);
    const docRef = doc(FIRESTORE, "schedules", schedule.id).withConverter(
      ScheduleConverter,
    );
    const membershipDocRef = doc(
      FIRESTORE,
      "scheduleMembership",
      schedule.id,
    ).withConverter(ScheduleMembershipConverter);

    batch.set(
      membershipDocRef,
      {
        members: {
          [prevMember.id]: member,
        },
      },
      {merge: true},
    );

    if (prevMember.email !== member.email) {
      const emailsList = schedule.members ?? [];

      const newArray = emailsList.map(email => {
        if (email === prevMember.email) {
          // Replace the item with a new value
          return member.email;
        }
        return email;
      });

      batch.set(
        docRef,
        {
          members: newArray,
        },
        {merge: true},
      );
    }

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    updateSchedule,
    addMember,
    addBulkMember,
    removeMember,
    updateMember,
  };
}

export default useSelectedTeamActions;
