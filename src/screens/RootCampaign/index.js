import {
  Accordion,
  ActionIcon,
  Autocomplete,
  Button,
  Center,
  Fieldset,
  Tabs,
  TagsInput,
} from "@mantine/core";
import styles from "./RootCampaign.module.sass";
import cn from "classnames";
import { IconDots } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { map } from "lodash";

const AccordionPanel = (props) => {
  const { campIds: rootCampIds } = props;
  const [campIds, setCampIds] = useState(rootCampIds || ["123"]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(campIds);
  }, [campIds]);
  return (
    <TagsInput
      label="Camp IDs"
      data={data}
      value={campIds}
      onChange={setCampIds}
      placeholder="Enter CampId"
      splitChars={[",", " ", "|", "\r\n", "\n"]}
      clearable
    />
  );
};
function AccordionControl(props) {
  return (
    <Center>
      <Accordion.Control {...props} />
      <ActionIcon size="lg" variant="subtle" color="gray">
        <IconDots size="1rem" />
      </ActionIcon>
    </Center>
  );
}
const RootCampaign = ({ ads = [] }) => {
  const [campIds, setCampIds] = useState([]);

  const charactersList = [
    {
      id: "bender",
      image: "https://img.icons8.com/clouds/256/000000/futurama-bender.png",
      label: "20120331",
      description: "Fascinated with cooking, though has no sense of taste",
      content:
        "Bender Bending Rodríguez, (born September 4, 2996), designated Bending Unit 22, and commonly known as Bender, is a bending unit created by a division of MomCorp in Tijuana, Mexico, and his serial number is 2716057. His mugshot id number is 01473. He is Fry's best friend.",
    },

    {
      id: "carol",
      image: "https://img.icons8.com/clouds/256/000000/futurama-mom.png",
      label: "20120332",
      description: "One of the richest people on Earth",
      content:
        "Carol Miller (born January 30, 2880), better known as Mom, is the evil chief executive officer and shareholder of 99.7% of Momcorp, one of the largest industrial conglomerates in the universe and the source of most of Earth's robots. She is also one of the main antagonists of the Futurama series.",
    },

    {
      id: "homer",
      image: "https://img.icons8.com/clouds/256/000000/homer-simpson.png",
      label: "20120333",
      description: "Overweight, lazy, and often ignorant",
      content:
        "Homer Jay Simpson (born May 12) is the main protagonist and one of the five main characters of The Simpsons series(or show). He is the spouse of Marge Simpson and father of Bart, Lisa and Maggie Simpson.",
    },
  ];
  const items = map(charactersList, (item) => (
    <Accordion.Item value={item.id} key={item.label}>
      <AccordionControl>{item.label}</AccordionControl>
      <Accordion.Panel>
        <AccordionPanel {...item} />
      </Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <>
      <Tabs color="teal" defaultValue="first">
        <Tabs.List>
          <Tabs.Tab value="first">Tạo Camp Phôi</Tabs.Tab>
          <Tabs.Tab value="second">Danh sách Camp Phôi</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel color="teal" value="first" pt="xs">
          <Card
            className={cn(styles.card, styles.clipArtCard)}
            title="Camp Phôi"
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            <Fieldset
              legend="Thông tin"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Autocomplete
                label="Account ID"
                placeholder="Account ID"
                data={["React", "Angular", "Vue", "Svelte"]}
              />
              <TagsInput
                label="Camp IDs"
                data={campIds}
                value={campIds}
                onChange={setCampIds}
                placeholder="Enter CampId"
                splitChars={[",", " ", "|", "\r\n", "\n"]}
                clearable
              />
            </Fieldset>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button>Tạo</Button>
            </div>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel color="teal" value="second" pt="xs">
          <Accordion chevronPosition="left" variant="contained">
            {items}
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default RootCampaign;
