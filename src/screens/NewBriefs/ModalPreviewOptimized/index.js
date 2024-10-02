import { Badge, Button, Grid, Image, Modal, Text } from "@mantine/core";
import cn from "classnames";

const ModalPreviewOptimized = ({
  opened,
  close,
  batch,
  workGroup,
  rndMember,
  briefType,
  handleSubmitBrief,
  SKU,
  generateTextPreview,
  createBriefLoading,
  layout,
}) => {
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
      size="lg"
    >
      <Grid>
        <Grid.Col span={12}>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#D9F5D6",
              border: "1px solid #62D256",
              color: "#000000",
              borderColor: "#62D256",
              fontSize: "18px",
              borderRadius: "12px",
            }}
          >
            <Grid>
              <Grid.Col span={4}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Batch: <span>&nbsp;{batch}</span>
                </Text>
              </Grid.Col>
              <Grid.Col
                span={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  style={{ margin: "0 5px" }}
                >
                  {generateTextPreview(briefType, layout)}
                </Badge>{" "}
              </Grid.Col>
              <Grid.Col span={4}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    fontSize: "14px",
                  }}
                >
                  {workGroup} - {rndMember}
                </div>
              </Grid.Col>
            </Grid>
          </div>
        </Grid.Col>
        <Grid.Col span={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              fontSize: "20px",
              alignItems: "center",
            }}
          >
            Optimized
          </div>
          <Image
            radius="md"
            src={SKU?.image || "/images/content/not_found_2.jpg"}
            height={200}
            width={200}
            fit="contain"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              fontSize: "18px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            {SKU?.sku}
          </div>
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            className={cn("button-stroke-blue button-smal")}
            loading={createBriefLoading}
            onClick={handleSubmitBrief}
            style={{
              width: "150px",
              borderRadius: "20px",
              borderWidth: "2px",
              backgroundColor: "#3FA433",
              color: "#ffffff",
            }}
          >
            <span>Tạo Brief</span>
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default ModalPreviewOptimized;
