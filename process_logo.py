import numpy as np
from PIL import Image, ImageEnhance

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    arr = np.array(img, dtype=float)
    h, w, _ = arr.shape

    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]

    # Grid of coordinates
    x_coords, y_coords = np.meshgrid(np.arange(w), np.arange(h))

    # Sample background pixels near edges (avoiding emblem in center & watermark at bottom-left)
    bg_mask = np.zeros((h, w), dtype=bool)
    bg_mask[0:80, :] = True
    bg_mask[-40:, :] = True
    bg_mask[:, 0:80] = True
    bg_mask[:, -80:] = True
    
    # Exclude bottom-left watermark area from background training sample
    bg_mask[h-120:, 0:350] = False

    bg_y, bg_x = np.where(bg_mask)
    bg_r = r[bg_y, bg_x]
    bg_g = g[bg_y, bg_x]
    bg_b = b[bg_y, bg_x]

    # Polynomial fit for background color prediction
    A_train = np.column_stack([
        np.ones_like(bg_x),
        bg_x, bg_y,
        bg_x**2, bg_y**2, bg_x * bg_y
    ])

    coeff_r, _, _, _ = np.linalg.lstsq(A_train, bg_r, rcond=None)
    coeff_g, _, _, _ = np.linalg.lstsq(A_train, bg_g, rcond=None)
    coeff_b, _, _, _ = np.linalg.lstsq(A_train, bg_b, rcond=None)

    # Predict background color for all pixels
    x_flat = x_coords.ravel()
    y_flat = y_coords.ravel()
    A_full = np.column_stack([
        np.ones_like(x_flat),
        x_flat, y_flat,
        x_flat**2, y_flat**2, x_flat * y_flat
    ])

    est_r = A_full.dot(coeff_r).reshape(h, w)
    est_g = A_full.dot(coeff_g).reshape(h, w)
    est_b = A_full.dot(coeff_b).reshape(h, w)

    # Calculate distance from estimated background color
    dist = np.sqrt((r - est_r)**2 + (g - est_g)**2 + (b - est_b)**2)

    # Smooth alpha channel transition (soft anti-aliased cutout)
    alpha = np.clip((dist - 18.0) / (40.0 - 18.0) * 255.0, 0, 255)

    # Wipe watermark area at bottom-left
    watermark_area = (y_coords > h - 90) & (x_coords < 350)
    alpha[watermark_area] = 0

    out_arr = arr.copy()
    out_arr[:, :, 3] = alpha

    out_img = Image.fromarray(out_arr.astype(np.uint8), mode="RGBA")

    # Crop tightly to non-transparent alpha bounding box
    alpha_channel = out_img.split()[3]
    bbox = alpha_channel.getbbox()
    if bbox:
        pad = 25
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad)
        )
        out_img = out_img.crop(bbox)

    # Enhance sharpness and color saturation as requested
    enhancer_sharp = ImageEnhance.Sharpness(out_img)
    out_img = enhancer_sharp.enhance(1.8)

    enhancer_contrast = ImageEnhance.Contrast(out_img)
    out_img = enhancer_contrast.enhance(1.1)

    out_img.save(output_path, "PNG")
    print(f"Logo successfully created at {output_path}. Final size: {out_img.size}")

if __name__ == "__main__":
    process_logo('/Users/airm5/Downloads/WhatsApp Image 2026-08-31 at 19.59.48.jpeg', 'public/logo.png')
