import { Flex, Grid, Image, Select } from "@mantine/core";
import Card from "../../../components/Card";
import styles from "./PostCamp.module.sass";
import cn from "classnames";
const PostCamp = () => {
  return (
    <Card
      className={cn(styles.card, styles.clipArtCard)}
      title="Lên Post-Camp"
      classTitle="title-green"
      classCardHead={styles.classCardHead}
      classSpanTitle={styles.classScaleSpanTitle}
    >
      <Grid>
        <Grid.Col
          span={1}
          style={{
            height: "150px",
          }}
        >
          <Image
            src="https://plus.unsplash.com/premium_photo-1721257104603-b6b48b7ff239?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Post-Camp"
            className={styles.clipArt}
            height="100%"
            fit="contain"
          />
        </Grid.Col>
        <Grid.Col
          span={11}
          style={{
            height: "100px",
          }}
        >
          <Flex direction="column" gap={30}>
            <Flex>BD1 - CB-M0508 - M0001 - Test1</Flex>
            <Flex gap={50}>
              <Select
                label="Your favorite library"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
              />
              <Select
                label="Your favorite library"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
              />
              <Select
                label="Your favorite library"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
              />
              <Select
                label="Your favorite library"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
              />
            </Flex>
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default PostCamp;
