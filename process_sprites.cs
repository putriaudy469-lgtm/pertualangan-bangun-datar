using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageCleaner
{
    public static void CleanAndCrop(string srcPath, string outDir)
    {
        using (Bitmap src = new Bitmap(srcPath))
        {
            int w = src.Width;
            int h = src.Height;

            // 1. Create 32bpp transparent bitmap
            Bitmap clean = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(clean))
            {
                g.DrawImage(src, 0, 0, w, h);
            }

            // Lock bits for fast pixel processing
            BitmapData data = clean.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int stride = data.Stride;
            IntPtr scan0 = data.Scan0;

            unsafe
            {
                byte* ptr = (byte*)scan0;

                // BFS queue for flood filling from outside borders
                bool[,] visited = new bool[w, h];
                Queue<Point> queue = new Queue<Point>();

                Func<byte, byte, byte, bool> isChecker = (b, gVal, r) =>
                {
                    // Checkerboard is light gray / white (r,g,b > 230 and near neutral)
                    int diffRG = Math.Abs(r - gVal);
                    int diffGB = Math.Abs(gVal - b);
                    int diffRB = Math.Abs(r - b);
                    return (r >= 225 && gVal >= 225 && b >= 225 && diffRG <= 12 && diffGB <= 12 && diffRB <= 12);
                };

                // Check borders
                for (int x = 0; x < w; x++)
                {
                    // top
                    int idxTop = x * 4;
                    if (isChecker(ptr[idxTop], ptr[idxTop + 1], ptr[idxTop + 2]))
                    {
                        visited[x, 0] = true;
                        queue.Enqueue(new Point(x, 0));
                    }
                    // bottom
                    int idxBot = (h - 1) * stride + x * 4;
                    if (isChecker(ptr[idxBot], ptr[idxBot + 1], ptr[idxBot + 2]))
                    {
                        visited[x, h - 1] = true;
                        queue.Enqueue(new Point(x, h - 1));
                    }
                }

                for (int y = 0; y < h; y++)
                {
                    // left
                    int idxLeft = y * stride;
                    if (isChecker(ptr[idxLeft], ptr[idxLeft + 1], ptr[idxLeft + 2]))
                    {
                        visited[0, y] = true;
                        queue.Enqueue(new Point(0, y));
                    }
                    // right
                    int idxRight = y * stride + (w - 1) * 4;
                    if (isChecker(ptr[idxRight], ptr[idxRight + 1], ptr[idxRight + 2]))
                    {
                        visited[w - 1, y] = true;
                        queue.Enqueue(new Point(w - 1, y));
                    }
                }

                int[] dx = { 1, -1, 0, 0 };
                int[] dy = { 0, 0, 1, -1 };

                while (queue.Count > 0)
                {
                    Point p = queue.Dequeue();
                    int pIdx = p.Y * stride + p.X * 4;
                    // Set alpha to 0
                    ptr[pIdx + 3] = 0;

                    for (int i = 0; i < 4; i++)
                    {
                        int nx = p.X + dx[i];
                        int ny = p.Y + dy[i];
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny])
                        {
                            visited[nx, ny] = true;
                            int nIdx = ny * stride + nx * 4;
                            if (isChecker(ptr[nIdx], ptr[nIdx + 1], ptr[nIdx + 2]))
                            {
                                queue.Enqueue(new Point(nx, ny));
                            }
                        }
                    }
                }
            }

            clean.UnlockBits(data);

            // Save full clean transparent sheet
            clean.Save(System.IO.Path.Combine(outDir, "spritesheet_clean.png"), ImageFormat.Png);

            // Crop individual assets:
            // 1. Logo
            CropAndSave(clean, new Rectangle(60, 5, 560, 305), System.IO.Path.Combine(outDir, "logo.png"));

            // 2. Landscape middle (from y=315 to y=710)
            CropAndSave(clean, new Rectangle(10, 315, 660, 395), System.IO.Path.Combine(outDir, "landscape_middle.png"));

            // 3. Walking Character (Triangle with boots)
            CropAndSave(clean, new Rectangle(315, 810, 160, 175), System.IO.Path.Combine(outDir, "character_triangle.png"));

            // 4. Wooden Signpost
            CropAndSave(clean, new Rectangle(15, 815, 165, 160), System.IO.Path.Combine(outDir, "signpost.png"));

            // 5. Flag on hill
            CropAndSave(clean, new Rectangle(180, 815, 130, 160), System.IO.Path.Combine(outDir, "flag_hill.png"));

            // 6. Shapes (triangle, square, circle)
            CropAndSave(clean, new Rectangle(480, 825, 195, 75), System.IO.Path.Combine(outDir, "shapes_row.png"));

            // 7. Bush
            CropAndSave(clean, new Rectangle(510, 895, 165, 85), System.IO.Path.Combine(outDir, "bush_flower.png"));

            clean.Dispose();
        }
    }

    private static void CropAndSave(Bitmap src, Rectangle rect, string outPath)
    {
        rect.Intersect(new Rectangle(0, 0, src.Width, src.Height));
        if (rect.Width <= 0 || rect.Height <= 0) return;

        using (Bitmap cropped = src.Clone(rect, PixelFormat.Format32bppArgb))
        {
            cropped.Save(outPath, ImageFormat.Png);
        }
    }
}
