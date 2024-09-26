import { Grid, Modal, ScrollArea } from "@mantine/core";
import CustomTable from "../../../components/Table";
const ModalPreviewMixMatch = ({
  opened,
  close,
  batch,
  workGroup,
  rndMember,
  briefType,
  generateHeaderTable,
  handleRemoveRow,
  isKeepClipArt,
  handleSubmitBrief,
  editSKUs,
  setEditSKUs,
  SKU,
  setSKU,
  setProductBases,
  productBases,
  selectedProductBases,
  setSelectedProductBases,
  rndInfo,
  triggerCreateSKUPayload
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
      size="1000px"
    >
      <Grid>
        <Grid.Col span={12}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              backgroundColor: "#D9F5D6",
              border: "1px solid #62D256",
              color: "#000000",
              borderColor: "#62D256",
              fontSize: "18px",
              borderRadius: "12px",
            }}
          >
            PREVIEW BRIEF - {batch}
          </div>
        </Grid.Col>
        <Grid.Col span={12}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
              fontSize: "18px",
            }}
          >
            New - Mix Match
          </div>
        </Grid.Col>
        <Grid.Col span={12}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {workGroup} - {rndMember}
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <ScrollArea h={300} scrollbars="y" scrollbarSize={2}>
            <CustomTable
              items={editSKUs}
              headers={generateHeaderTable(briefType, isKeepClipArt)?.headers}
              onRemove={handleRemoveRow}
              headerRemove={
                generateHeaderTable(briefType, isKeepClipArt)?.removeHeader
              }
              editSKUs={editSKUs}
              setEditSKUs={setEditSKUs}
              setProductBases={setProductBases}
              productBases={productBases}
              SKU={SKU}
              setSKU={setSKU}
              selectedProductBases={selectedProductBases}
              setSelectedProductBases={setSelectedProductBases}
              rndInfo={rndInfo}
              triggerCreateSKUPayload={triggerCreateSKUPayload}
            />
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button
              className="button-stroke-blue button-small"
              onClick={handleSubmitBrief}
              style={{
                marginTop: "24px",
                marginBottom: "12px",
                width: "150px",
                borderRadius: "20px",
                borderWidth: "2px",
                backgroundColor: "#3FA433",
                color: "#ffffff",
              }}
            >
              <span>Tạo Brief</span>
            </button>
          </div>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default ModalPreviewMixMatch;
