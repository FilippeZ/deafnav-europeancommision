import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execAsync = util.promisify(exec);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const video = searchParams.get('video') || 'connecting-europe.mp4';

    // Path to the Python script in our backend
    const scriptPath = path.join(process.cwd(), "..", "backend", "src", "ml", "sl_translator.py");
    // Also support local path if running from dpbl
    const localScriptPath = path.join(process.cwd(), "backend", "src", "ml", "sl_translator.py");

    try {
        // Attempt to run the Python vision pipeline translation
        const cmd = `python "${localScriptPath}" --video "${video}"`;
        const { stdout, stderr } = await execAsync(cmd);

        return NextResponse.json({
            success: true,
            video: video,
            translatorOutput: stdout,
            modelArchitecture: "YOLOv8 + MediaPipe Hand Tracking"
        });
    } catch (e: any) {
        return NextResponse.json({
            error: "ML Vision pipeline execution failed",
            details: e.message
        }, { status: 500 });
    }
}
