<?php

namespace App\Http\Controllers;

use App\Models\PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PDFController extends Controller
{
    public function index()
    {
        return Inertia::render('PDFs/Index', [
            'pdfs' => PDF::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
//        $request->validate([
//            'pdfs' => 'required',
//        ]);

        $savedPdfs = [];
        $files = $request->file('pdfs');

        if (is_array($files)) {
            foreach ($files as $file) {
                $filename = Str::random(40) . '.pdf';
                $path = $file->storeAs('pdfs', $filename, 'public');

                $pdf = PDF::create([
                    'filename' => $filename,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName()
                ]);

                $savedPdfs[] = $pdf;
            }
        }

        return redirect()->back()->with('success', 'PDFs uploaded successfully');
    }

    public function destroy(PDF $pdf)
    {
        Storage::disk('public')->delete($pdf->path);
        $pdf->delete();

        return redirect()->back()->with('success', 'PDF deleted successfully');
    }
}
