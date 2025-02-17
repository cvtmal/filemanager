import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Document, Page } from 'react-pdf';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2 } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import GuestLayout from '@/Layouts/GuestLayout';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

export default function Index({ pdfs, auth }) {
    const [selectedPDFs, setSelectedPDFs] = useState([]);
    const { data, setData, post, progress, delete: destroy } = useForm({
        pdfs: null,
    });

    const handleFileUpload = (e) => {
        setData('pdfs', e.target.files);

        post(route('pdfs.store'), {
            preserveScroll: true,
            onError: errors => {
                console.error(errors);
            },
        });
    };

    const toggleSelection = (pdf) => {
        setSelectedPDFs(current => {
            if (current.find(p => p.id === pdf.id)) {
                // If it's already selected, remove it
                return current.filter(p => p.id !== pdf.id);
            }
            // Otherwise, add it
            return [...current, pdf];
        });
    };

    const handleDelete = (pdf) => {
        if (confirm('Are you sure you want to delete this PDF?')) {
            destroy(route('pdfs.destroy', pdf.id));
        }
    };

    return (
        <GuestLayout>
            <Head title="PDF Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-50 overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <div className="mb-6">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="pdf-upload"
                            />
                            <div className="flex justify-center mt-6 mb-12">
                                <Button
                                    onClick={() => document.getElementById('pdf-upload').click()}
                                    disabled={progress}
                                    className="px-6 py-3"
                                >
                                    {progress ? `Uploading (${progress.percentage}%)` : 'Upload PDFs'}
                                </Button>
                            </div>


                            {progress && (
                                <div className="mt-2">
                                    <progress value={progress.percentage} max="100">
                                        {progress.percentage}%
                                    </progress>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                            {pdfs.map((pdf) => {
                                // Find the index of the current PDF in the selected list
                                const selectedIndex = selectedPDFs.findIndex(p => p.id === pdf.id);
                                const isSelected = selectedIndex >= 0;

                                return (
                                    <Card
                                        key={pdf.id}
                                        className={`relative cursor-pointer hover:shadow-lg transition-shadow ${
                                            isSelected ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    >
                                        <CardContent className="p-4">
                                            <div
                                                className="relative flex justify-center"
                                                onClick={() => toggleSelection(pdf)}
                                            >
                                                <Document
                                                    file={pdf.url}
                                                    onLoadError={(error) => {
                                                        console.error('PDF load error:', error, pdf.url);
                                                    }}
                                                    loading={
                                                        <div className="flex items-center justify-center h-96">
                                                            <p>Loading PDF...</p>
                                                        </div>
                                                    }
                                                    error={
                                                        <div className="flex items-center justify-center h-96">
                                                            <p className="text-red-500">Error loading PDF</p>
                                                        </div>
                                                    }
                                                >
                                                    <Page
                                                        pageNumber={1}
                                                        width={260}
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                        onLoadError={(error) => {
                                                            console.error('Page load error:', error);
                                                        }}
                                                    />
                                                </Document>

                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                                                        <CheckCircle className="w-6 h-6 text-blue-500" />
                                                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            {selectedIndex + 1}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <p className="text-sm truncate flex-1">
                                                    {pdf.original_name}
                                                </p>
                                                <button
                                                    onClick={() => handleDelete(pdf)}
                                                    className="p-1 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {selectedPDFs.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    {selectedPDFs.length} file(s) selected
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
