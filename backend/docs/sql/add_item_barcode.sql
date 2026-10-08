-- Run once on the RTS MySQL database (rts_system) before using DR barcode scanning.
-- delivery_details.serial_no already exists for captured serial stickers.

ALTER TABLE setup_items
  ADD COLUMN barcode VARCHAR(64) NULL AFTER item_name;

CREATE INDEX setup_items_barcode_idx ON setup_items (barcode);
