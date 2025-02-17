<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PDF extends Model
{
    protected $fillable = ['filename', 'path', 'original_name'];

    protected $appends = ['url'];

    protected $table = 'pdfs';

    public function getUrlAttribute()
    {
        return asset('storage/'.$this->path);
    }
}
