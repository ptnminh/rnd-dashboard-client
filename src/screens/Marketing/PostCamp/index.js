import {
  Button,
  Flex,
  Grid,
  Group,
  Image,
  List,
  Modal,
  rem,
  Select,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import Card from "../../../components/Card";
import styles from "./PostCamp.module.sass";
import cn from "classnames";
import { map } from "lodash";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const Ads = () => {
  return (
    <>
      <Grid.Col
        span={12}
        style={{
          marginTop: "10px",
          padding: "10px",
        }}
      >
        <Flex direction="column" gap={10}>
          <Flex
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            <span
              style={{
                padding: "5px",
                backgroundColor: "#E0EAFF",
                borderRadius: "5px",
              }}
            >
              Ad1: CB-M0508 - Image1
            </span>
          </Flex>
          <Flex
            style={{
              marginLeft: "20px",
            }}
          >
            <Grid>
              <Grid.Col
                span={1}
                style={{
                  height: "80%",
                }}
              >
                <div
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Hình Ads
                </div>
                <Image
                  src="https://plus.unsplash.com/premium_photo-1721257104603-b6b48b7ff239?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Post-Camp"
                  className={styles.clipArt}
                  height="100%"
                  fit="contain"
                  radius="md"
                  style={{
                    width: "66%",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={11}>
                <Flex gap={20} wrap={true}>
                  <Select
                    label="Post Caption"
                    data={["React", "Angular", "Vue", "Svelte"]}
                    style={{
                      flexGrow: 0.7,
                    }}
                    styles={{
                      label: {
                        fontSize: "16px",
                        marginBottom: "10px",
                        fontWeight: "bold",
                      },
                      input: {
                        width: "100%",
                        height: "100px",
                      },
                    }}
                  />
                  <TextInput
                    placeholder="https://pawfecthouse.com/TOY-001"
                    label="CTA Link"
                    style={{
                      flexGrow: 0.2,
                    }}
                    styles={{
                      label: {
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      },
                      root: {},
                    }}
                  />
                </Flex>
              </Grid.Col>
            </Grid>
          </Flex>
        </Flex>
      </Grid.Col>
    </>
  );
};

const ModalPreview = ({ opened, close, ads }) => {
  const [selectedAds, setSelectedAds] = useState(ads[0]);
  return (
    <Modal
      opened={opened}
      onClose={close}
      transitionProps={{ transition: "fade", duration: 200 }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      radius="md"
      size="60%"
      title="1/2"
      styles={{
        header: {
          position: "relative",
        },
        title: {
          position: "absolute",
          left: "50%",
        },
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "17%",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          cursor: "pointer",
        }}
        onClick={() => {
          // handleChangePreviousSlide(selectedSKU?.uid);
        }}
      >
        <IconChevronLeft size={48} color="#228be6" />
      </span>
      <Grid>
        <Grid.Col
          span={7}
          style={{
            backgroundColor: "#F6F7F7",
            paddingTop: "20px",
            borderRadius: "10px",
          }}
        >
          <Flex
            direction="column"
            gap={40}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Flex
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
              }}
            >
              <span
                style={{
                  padding: "5px",
                  backgroundColor: "#E0EAFF",
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                Ad1: CB-M0508 - Image1
              </span>
            </Flex>
            <Flex gap={30} direction="column">
              <Textarea
                value={
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                }
                autosize
                minRows={6}
                maxRows={8}
              />
              <Image
                radius="md"
                src={selectedAds?.image || "/images/content/not_found_2.jpg"}
                height="80%"
                fit="contain"
                style={{
                  cursor: "pointer",
                  margin: "auto",
                  width: "90%",
                  position: "relative",
                  height: " 200px",
                  top: "-80px",
                }}
              />
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={5}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "#EFF0F1",
            paddingTop: "20px",
          }}
        >
          <Flex direction="column" gap={20}>
            {" "}
            <div>Target</div>
            <List
              spacing="sm"
              size="sm"
              center
              style={{
                marginLeft: "20px",
              }}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck
                    style={{ width: rem(16), height: rem(16) }}
                  />
                </ThemeIcon>
              }
            >
              <List.Item>Clone or download repository from GitHub</List.Item>
              <List.Item>Install dependencies with yarn</List.Item>
              <List.Item>
                To start development server run npm start command
              </List.Item>
              <List.Item>
                Run tests to make sure your changes do not break the build
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCircleDashed
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                Submit a pull request once you are done
              </List.Item>
            </List>
          </Flex>
        </Grid.Col>
      </Grid>
      <span
        style={{
          position: "absolute",
          top: "50%",
          right: "17%",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          cursor: "pointer",
        }}
        onClick={() => {
          // handleChangeNextSlide(selectedSKU?.uid);
        }}
      >
        <IconChevronRight size={48} color="#228be6" />
      </span>
    </Modal>
  );
};

const PostCamp = ({ ads = [] }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Card
        className={cn(styles.card, styles.clipArtCard)}
        title="Lên Post-Camp"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
      >
        <Grid
          style={{
            backgroundColor: "#F6F7F7",
            padding: "10px",
          }}
        >
          <Grid.Col
            span={1}
            style={{
              height: "150px",
              padding: "10px",
              backgroundColor: "#E0EAFF",
            }}
          >
            <Image
              src="https://plus.unsplash.com/premium_photo-1721257104603-b6b48b7ff239?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Post-Camp"
              height="100%"
              fit="contain"
              radius="md"
            />
          </Grid.Col>
          <Grid.Col
            span={11}
            style={{
              height: "150px",
              padding: "10px",
              backgroundColor: "#E0EAFF",
            }}
            wrap={true}
          >
            <Flex
              direction="column"
              gap={40}
              style={{
                height: "100%",
              }}
            >
              <Flex
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                BD1 - CB-M0508 - M0001 - Test1
              </Flex>
              <Flex gap={30}>
                <Select
                  label="Account"
                  placeholder="Choose account"
                  data={["React", "Angular", "Vue", "Svelte"]}
                  styles={{
                    label: {
                      fontSize: "16px",
                      fontWeight: "bold",
                    },
                    root: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    },
                  }}
                />
                <Select
                  label="Page"
                  placeholder="Choose page"
                  data={["React", "Angular", "Vue", "Svelte"]}
                  styles={{
                    label: {
                      fontSize: "16px",
                      fontWeight: "bold",
                    },
                    root: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    },
                  }}
                />
                <Select
                  label="Target"
                  placeholder="Choose target"
                  data={["React", "Angular", "Vue", "Svelte"]}
                  styles={{
                    label: {
                      fontSize: "16px",
                      fontWeight: "bold",
                    },
                    root: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    },
                  }}
                />
                <TextInput
                  placeholder="Budget"
                  label="Budget"
                  styles={{
                    label: {
                      fontSize: "16px",
                      fontWeight: "bold",
                    },
                    root: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    },
                  }}
                />
              </Flex>
            </Flex>
          </Grid.Col>
          {map([1, 2, 3, 4], (index) => (
            <Ads />
          ))}

          <Group
            style={{
              marginTop: "20px",
              width: "100%",
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Flex
              gap={20}
              justify="flex-end"
              style={{
                width: "100%",
              }}
            >
              <Button
                variant="filled"
                color="#646A73"
                radius="sm"
                onClick={open}
              >
                Preview
              </Button>
              <Button variant="filled" color="#646A73" radius="sm">
                Gắn CTA
              </Button>
              <Button variant="filled" color="#4BA241" radius="sm">
                Create Camp
              </Button>
            </Flex>
          </Group>
        </Grid>
      </Card>

      <ModalPreview opened={opened} close={close} ads={ads} />
    </>
  );
};

export default PostCamp;
